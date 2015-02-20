import Ember from 'ember';
import config from '../config/environment';

var Ref = new window.Firebase(config.firebaseURL);

var auth = Ember.Object.extend({
  authed: false,
  username: '',
  init: function() {
    this.authClient = new window.FirebaseSimpleLogin(Ref, function(error, githubUser) {
      if (error) {
        alert('Authentication failed: ' + error);
      } else if (githubUser) {
        this.set('authed', true);
        this.set('username',githubUser.username);
      } else {
        this.set('authed', false);
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
