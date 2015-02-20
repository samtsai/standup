import Ember from 'ember';
import config from '../config/environment';

var ref = new window.Firebase(config.firebaseURL);

var auth = Ember.Object.extend({
  authed: false,
  username: '',
  init: function() {
    this.authClient = ref.authWithOAuthPopup("github", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        this.set('authed', true);
      }
    }.bind(this));
  },

  logout: function() {
    this.authClient.logout();
    this.set('authed', false);
  }
});

export function initialize( container, app ) {
  // application.inject('route', 'foo', 'service:foo');
  app.register('auth:main', auth, {singleton: true});
  app.inject('controller', 'auth', 'auth:main');
  app.inject('route', 'auth', 'auth:main');
}

export default {
  name: 'auth',
  initialize: initialize
};
