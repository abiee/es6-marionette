import $ from 'jquery';
import Backbone from 'backbone';
import AppLayout from 'AppLayout';

describe('Rendering the main layout', function() {
  it('renders correctly', function() {
    var layout = new AppLayout();
    layout.render();

    expect($(layout.el).find('h4')).to.exist;
  });
});

describe('Example of loading a JSON fixture', function() {
  it('will create a model from a loaded JSON', function() {
    var model = new Backbone.Model({name: 'John Doe'});
    expect(model.get('name')).to.equal('John Doe');
  });
});
