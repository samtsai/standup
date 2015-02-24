/* Original source: https://gist.github.com/oskarrough/914653b03d886c015320
 * Modified fork:  	https://gist.github.com/consideRatio/761c6286158e70feaed7
 *
 * Working authentication with
 * Firebase 2.0.x + Ember.js 1.8.1 + Ember Data Canary + EmberFire 1.3.0 + Ember CLI
 * works for me! oskar@rough.dk
 *
 * Note: this assumes you've set up login on your Firebase,
 * only handles Google and Facebook for now.
 *
 * Before usage:
 * Decide on how you want your logout function to behave, check the comments in that function
 *
 * Usage:
 * In your templates: <button {{action 'login' 'google'}}>Log in with Google</button>
 * In your actions (on the application route for example):
	login: function(provider) {
		this.session.login(provider, {scope: 'user,email'});
	},

	logout: function() {
		this.session.logout();
*/
import Ember from 'ember';
import ENV from '../config/environment';

var ref = new window.Firebase(ENV.firebaseURL);

export function initialize( container, app ) {
  var session = Ember.Object.extend({
    authed: false,
    store: container.lookup('store:main'),
    revokeAppAccess: function() {
  		if (this.get('authData')) {
  			var url, params;
  			switch (this.get('authData.provider')) {
  				case "google":
  					url 	= 'https://accounts.google.com/o/oauth2/revoke';
  					params 	= { token: this.get('authData.google.accessToken') };
  					break;
  				case "facebook":
  					url 	= 'https://graph.facebook.com/v2.2/me/permissions';
  					params 	= { access_token: this.get('authData.facebook.accessToken'), method: 'delete' };
  					break;
  				default:
  					return;
  			}
  			Ember.$.ajax(url, {
  				type: 'POST',
  				data: params,
  				crossDomain: true,
  				dataType: 'jsonp',
  				contentType: 'application/json'
  			});
  		}
  	},
    init: function() {
      // on init try to login
  		ref.onAuth(function(authData) {

  			// Not authenticated
  			if (!authData) {
  				this.set('authed', false);
  				this.set('authData', null);
  				this.set('user', null);
  				return false;
  			}

  			// Authenticated
  			this.set('authed', true);
  			this.set('authData', authData);
        console.log('authData', authData);
  			this.afterAuthentication(authData.uid);
  		}.bind(this));
    },

    login: function(provider) {
      this._loginWithPopup(provider);
    },
    logout: function() {
      ref.unauth();
    },
    // Default login method
    _loginWithPopup: function(provider, options) {
    	var _this = this;
    	// Ember.debug('logging in with popup');
    	ref.authWithOAuthPopup(provider, function(error, authData) {
    		if (error) {
          console.log("Login Failed!", error);

    			if (error.code === "TRANSPORT_UNAVAILABLE") {
    				// fall-back to browser redirects, and pick up the session
    				// automatically when we come back to the origin page
    				_this._loginWithRedirect(provider);
    			}
    		} else if (authData) {
    			// we're good!
    			// this will automatically call the on ref.onAuth method inside init()
    		}
    	}, options);
    },
    // Alternative login with redirect (needed for Chrome on iOS)
  	_loginWithRedirect: function(provider, options) {
  		ref.authWithOAuthRedirect(provider, function(error, authData) {
  			if (error) {

  			} else if (authData) {
  				// we're good!
  				// this will automatically call the on ref.onAuth method inside init()
  			}
  		}, options);
  	},
    // Runs after authentication
  	// It either sets a new or already exisiting user
  	afterAuthentication: function(userId) {
  		var _this = this;

  		// See if the user exists using native Firebase because of EmberFire problem with "id already in use"
  		ref.child('users').child(userId).once('value', function(snapshot) {
  			var exists = (snapshot.val() !== null);
  			userExistsCallback(userId, exists);
  		});

  		// Do the right thing depending on whether the user exists
  		function userExistsCallback(userId, exists) {
  			if (exists) {
  				_this.existingUser(userId);
  			} else {
  				_this.createUser(userId);
  			}
  		}
  	},

  	// Existing user
  	existingUser: function(userId) {
      this.store.find('user', userId).then(function(user) {
				this.set('user', user);
			}.bind(this));
  	},

  	// Create a new user
  	createUser: function(userId) {
  		var _this = this,
        _provider = this.get('authData.provider');

  		this.get('store').createRecord('user', {
  			id: userId,
  			provider: _provider,
  			name: this.get('authData.' + _provider + '.displayName'),
  			email: this.get('authData.' + _provider + '.email'),
  			created: new Date().getTime()
  		}).save().then(function(user){
  			// Proceed with the newly create user
  			_this.set('user', user);
  		});
  	},

  	// This is the last step in a successful authentication
  	// Set the user (either new or existing)
  	afterUser: function(user) {
  		this.set('user', user);
  	}
  });

  // Register and inject the 'session' initializer into all controllers and routes
  app.register('session:main', session);
  app.inject('controller', 'session', 'session:main');
  app.inject('route', 'session', 'session:main');
}

export default {
  name: 'session',
  after: 'store', // Run the initializer after the store is ready
  initialize: initialize
};
