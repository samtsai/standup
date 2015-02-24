import Ember from 'ember';

var scope = {
  'github': 'user',
  'google': 'email',
  'twitter': 'email'
};

export default Ember.Controller.extend({
  needs: ['updates/edit'],
  actions: {
    login: function(provider) {
      this.session.login(provider, {
        scope: scope.provider
      });
    },

    logout: function() {
      this.session.logout();
      this.set('controllers.updates/edit.isEditing', false);
      this.transitionToRoute('updates');
    }
  }
});
