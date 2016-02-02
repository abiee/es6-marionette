import Marionette from 'backbone.marionette';
import layoutTemplate from '../templates/index.hbs';

import Backbone from 'backbone';


export default class IndexView extends Marionette.LayoutView {

  template = layoutTemplate;

  constructor(...rest) {
    super(...rest);

  }

}
