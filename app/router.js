import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("updates", function() {
    this.route("new");
    this.route("edit",{
      path: ":update_id"
    });
  });
});

export default Router;
