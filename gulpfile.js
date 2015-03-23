
/* jshint node:true */
'use strict';

var karma = require('karma').server;
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Lint Javascript
gulp.task('jshint', function () {
  return gulp.src([
      'app/scripts/**/*.js',
      '!app/scripts/config.js',
      '!app/scripts/vendor/**/*.js'
  ])
    .pipe($.jshint({ lookup: true }))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
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
    'jspm_packages/github/twbs/bootstrap@*/fonts/**/*'
  ])
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
  return gulp.src('app/styles/main.css')
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(gulp.dest('.tmp/styles'));
});

// Scan your HTML for assets & optimize them
gulp.task('html', ['styles'], function () {
  var lazypipe = require('lazypipe');
  var minifyCSS = require('gulp-minify-css');
  var cssChannel = lazypipe()
    .pipe(minifyCSS)
    .pipe($.replace, /'fonts\/glyphicons[.a-z]*/g, '\'../fonts')
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/*.html')
    .pipe($.htmlReplace({ js: ['scripts/app.js' ] }))
    .pipe(assets)
    // Concatenate and minify JavaScript
    .pipe($.if('*.js', $.uglify()))
    // Concatenate and minify Styles
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Clean output directory and cached images
gulp.task('clean', function (callback) {
  var del = require('del')
  del(['.tmp', 'dist'], function () {
    $.cache.clearAll(callback);
  });
});

// Run connect server
gulp.task('connect', ['styles'], function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('app'))
    .use(serveStatic('.tmp'))
    .use('/jspm_packages', serveStatic('jspm_packages'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

// Minify and compile handlebars templates
gulp.task('templates', function () {
  return gulp.src('app/scripts/**/*.hbs')
    .pipe($.minifyHtml())
    .pipe($.handlebars())
    .pipe($.defineModule('commonjs'))
    .pipe(gulp.dest('.tmp/scripts'))
});

// Copy assets to distribution path
gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

// Transpile ES6 source files into JavaScript
gulp.task('transpile:app', ['templates'], function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.babel({ sourceMap: true }))
    .pipe(gulp.dest('.tmp/scripts'));
});

// Bundle javascripts
gulp.task('bundle:app', function() {
  return gulp.src('')
    .pipe($.shell('jspm bundle-sfx main dist/scripts/app.js --minify --skip-source-maps'));
});

// Run karma for development, will watch and reload
gulp.task('tdd', function(callback) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, callback);
});

// Run tests and report for ci
gulp.task('test', function(callback) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS'],
    reporters: ['dots', 'junit'],
    junitReporter: {
      outputFile: '.tmp/test-results.xml',
    }
  }, callback);
});

// Run development server environmnet
gulp.task('serve', ['connect', 'templates', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

// Watch files for changes & reload
gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    '.tmp/scripts/**/*.js',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/scripts/**/*.hbs', ['templates']);
  gulp.watch('app/styles/**/*.css', ['styles']);
});

gulp.task('build:app', function(callback) {
  var runSequence = require('run-sequence');
  runSequence('transpile:app',
              'bundle:app',
              callback);
});

// Build the project for distribution
gulp.task('build', ['jshint', 'build:app', 'html', 'images', 'fonts', 'extras'], function () {
  var size = $.size({title: 'build', gzip: true })
  return gulp.src('dist/**/*.js')
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
