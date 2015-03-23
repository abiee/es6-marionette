/* globals require */
var Backbone = require('backbone');

// Load Backbone with jspm does not import jquery, so we need to do it
// manually. See https://github.com/jspm/registry/issues/234
Backbone.$ = require('jquery');

require('app');
