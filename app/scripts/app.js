import Marionette from 'backbone.marionette';
import AppLayout from './appLayout';

var App = new Marionette.Application();

App.on('start', function() {
  'use strict';

  App.rootLayout = new AppLayout({el: '#demo'});
  App.rootLayout.render();
});

App.start();
