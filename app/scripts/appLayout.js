import Marionette from 'marionette';
import layoutTemplate from 'templates/layout';

export default class AppLayout extends Marionette.LayoutView {
  constructor(...rest) {
    super(...rest);
    this.template = layoutTemplate;
  }
}
