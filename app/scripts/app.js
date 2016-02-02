import Marionette from 'backbone.marionette';
import AppLayout from './AppLayout';

import IndexView from './views/IndexView';

var App = new Marionette.Application();

App.on('start', function() {
    'use strict';

    App.rootLayout = new AppLayout({el: 'body'});

    //App.rootLayout.render();
    App.rootLayout.content.show(new IndexView());
});

App.start();
