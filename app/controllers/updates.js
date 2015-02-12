import Ember from 'ember';

export default Ember.ArrayController.extend({

  init: function() {
    this.set('update', Ember.Object.create());
  },
  sortProperties: ['timestamp'],
  sortAscending: false, // sorts post by timestamp
  actions: {
    publishUpdate: function() {
      var newUpdate = this.store.createRecord('update', {
        author: this.get('update.author'),
        status: this.get('update.status'),
        timestamp: new Date()
      });
      newUpdate.save();
    }
  }

});
