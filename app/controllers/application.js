import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['updates/edit'],
  actions: {
    login: function(provider) {
      this.session.login(provider, {scope: 'email'});
    },

    logout: function() {
      this.session.logout();
      this.set('controllers.updates/edit.isEditing', false);
      this.transitionToRoute('updates');
    }
  }
});
