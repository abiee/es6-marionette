import Marionette from 'backbone.marionette';
import layoutTemplate from './templates/layout.hbs';

export default class AppLayout extends Marionette.LayoutView {
  constructor(...args) {
    super(...args);
    this.template = layoutTemplate;
  }
}
