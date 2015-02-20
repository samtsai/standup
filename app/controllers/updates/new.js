import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save: function() {
      var status= this.get('status');
      var author= this.get('auth').username;
      var date = new Date();
      if(!status.trim()) {return; } //empty string

      var update = this.store.createRecord('update', {
        status:status,
        author:author,
        date:date
      });

      this.set('status','');
      this.set('author','');
      update.save();

      this.transitionToRoute('updates');
    }
  }
});
