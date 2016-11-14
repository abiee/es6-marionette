/*eslint-env node*/

'use strict';

var KarmaServer = require('karma').Server;
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var data = require('gulp-data');
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('gulp-stylus');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var hbsfy = require('hbsfy');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Bundle files with browserify
gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var bundler = browserify({
    entries: 'app/scripts/app.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [babelify, hbsfy]
  });

  bundler = watchify(bundler);

  var rebundle = function() {
    return bundler.bundle()
      .on('error', $.util.log)
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .on('error', $.util.log)
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/scripts'));
  }

  bundler.on('update', rebundle);

  return rebundle();
});

// Bundle files with browserify for production
gulp.task('browserify:dist', function () {
  // set up the browserify instance on a task basis
  var bundler = browserify({
    entries: 'app/scripts/app.js',
    // defining transforms here will avoid crashing your stream
    transform: [babelify, hbsfy]
  });

  return bundler.bundle()
    .on('error', $.util.log)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest('dist/scripts'));
});

// Lint Javascript
gulp.task('lint', function () {
  return gulp.src([
      'app/scripts/**/*.js',
      '!app/scripts/config.js',
      '!app/scripts/vendor/**/*.js'
  ])
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

// Optimize images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
  return gulp.src([
    'app/{,styles/}fonts/**/*',
    'node_modules/bootstrap/dist/fonts/**/*'
  ])
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});


// -------------------- Start Stylus Section -------------------------

// Taken from https://www.npmjs.com/package/gulp-stylus

// Get one .styl file and render
gulp.task('one', function () {
  return gulp.src('app/stylus/main.styl')
    .pipe(stylus())
    .pipe(gulp.dest('.tmp/styles'));
});

// Options
// Options compress
gulp.task('compress', function () {
  return gulp.src('app/stylus/compressed.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('.tmp/styles'));
});


// Set linenos
gulp.task('linenos', function () {
  return gulp.src('app/stylus/linenos.styl')
    .pipe(stylus({linenos: true}))
    .pipe(gulp.dest('.tmp/styles'));
});

// Include css
// Stylus has an awkward and perplexing 'include css' option
gulp.task('include-css', function() {
  return gulp.src('app/stylus/*.styl')
    .pipe(stylus({
      'include css': true
    }))
    .pipe(gulp.dest('./'));

});

// Inline sourcemaps
gulp.task('sourcemaps-inline', function () {
  return gulp.src('app/stylus/sourcemaps-inline.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'));
});

// External sourcemaps
gulp.task('sourcemaps-external', function () {
  return gulp.src('app/stylus/sourcemaps-external.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/styles'));
});

// Pass an object in raw form to be accessable in stylus
var data = {red: '#ff0000'};
gulp.task('pass-object', function () {
  gulp.src('app/stylus/main.styl')
    .pipe(stylus({ rawDefine: { data: data }}))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({ stream: true }));
});

// Use with gulp-data
gulp.task('gulp-data', function() {
  gulp.src('app/**/*.styl')
    .pipe(data(function(){
      return {
        componentPath: '/' + (file.path.replace(file.base, '').replace(/\/[^\/]*$/, ''))
      };
    }))
    .pipe(stylus())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({ stream: true }));
});

/* Ex:
body
  color: data.red;
*/

// Default gulp task to run
gulp.task('stylus', ['one', 'compress', 'linenos', 'sourcemaps-inline', 'sourcemaps-external', 'pass-object']);

// -------------------- End Stylus Section -------------------------

// Scan your HTML for assets & optimize them
gulp.task('html', ['stylus'], function () {
  return gulp.src('app/*.html')
    .pipe($.htmlReplace())
    .pipe($.useref())
    .pipe($.if('*.css', $.csso()))
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

// Clean output directory and cached images
gulp.task('clean', function (callback) {
  var del = require('del')
  del(['.tmp', 'dist'], function () {
    $.cache.clearAll(callback);
  });
});

// Copy assets to distribution path
gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

// Run karma for development, will watch and reload
gulp.task('tdd', function(callback) {
  var karma = new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, callback);

  karma.start();
});

// Run tests and report for ci
gulp.task('test', function(callback) {
  var karma = new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS'],
    reporters: ['dots', 'junit'],
    junitReporter: {
      outputFile: '.tmp/test-results.xml'
    }
  }, callback);

  karma.start();
});

// Run development server environmnet
gulp.task('serve', ['stylus', 'browserify'], function () {
  browserSync({
    notify: false,
    port: 9000,
    ui: {
      port: 9001
    },
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/scripts/**/*.js'
  ]).on('change', reload);

  gulp.watch('app/stylus/**/*.styl', ['stylus']);
});

// Run web server on distribution files
gulp.task('serve:dist', function() {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
});

// Build the project for distribution
gulp.task('build', ['lint', 'browserify:dist', 'html', 'images', 'fonts', 'extras'], function () {
  var size = $.size({title: 'build', gzip: true })
  return gulp.src('dist/**/*')
    .pipe(size)
    .pipe($.notify({
      onLast: true,
      title: 'Build complete',
      message: function() {
        return 'Total scripts size (gzip) ' + size.prettySize;
      }
    }));
});

// Clean all and build from scratch
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
