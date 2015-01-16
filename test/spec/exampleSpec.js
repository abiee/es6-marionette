import Backbone from 'backbone';
import AppLayout from 'app-layout';

describe('Rendering the main layout', function() {
  it('renders correctly', function() {
    var layout = new AppLayout({el: fixture.el});
    layout.render();

    expect($(fixture.el).find('.row')).to.exist;
  });
});

describe('Example of loading a JSON fixture', function() {
  it('will create a model from a loaded JSON', function() {
    var loadedData = fixture.load('example.json');
    var model = new Backbone.Model(loadedData);
    expect(model.get('name')).to.equal('John Doe');;
  });
});
