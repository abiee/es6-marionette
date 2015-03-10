'use strict';
var webpack = require('webpack');

module.exports = {

  // Entry points to bundles to be created
  entry: {
    app: './app/scripts/app.js',
    core: [
      'jquery',
      'lodash',
      'backbone',
      'backbone.marionette',
      'vendor/marionette.radio.shim'
    ]
  },

  // Put generated bundles on distribution path
  output: {
    path: 'dist/scripts',
    publicPath: '/scripts/',
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js'
  },

  // Libraries supplied directly on the browser
  externals: {
    'jquery': 'jQuery'
  },

  // Module resoulution configuration
  resolve: {
    // append in order these extensions to modules imported
    extensions: ['', '.js'],

    // try to locate modules on these paths
    modulesDirectories: [
      'app/scripts',
      '.tmp/scripts',
      'web_modules',
      'bower_components',
      'node_modules',
      'test'
    ],

    alias: {
      // replace underscore for lodash
      underscore: 'lodash',
      handlebars: 'handlebars/handlebars'
    }
  },

  // Module loader configurtion
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules|bower_components/, loader: 'babel-loader' }
    ]
  },

  // Plugin configuration
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('core', 'core.js')
  ]
}
