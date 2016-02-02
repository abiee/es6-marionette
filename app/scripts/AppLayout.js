import Marionette from 'backbone.marionette';
import layoutTemplate from './templates/layout.hbs';

export default class AppLayout extends Marionette.LayoutView {
    myProp = 42;
    constructor(...rest) {
        super(...rest);
        console.log('myProp', this.myProp);
        this.template = layoutTemplate;
        this.addRegions({
            content: '#content'
        });
    }
}
