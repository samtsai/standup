import DS from 'ember-data';

export default DS.FirebaseAdapter.extend({
  firebase: new window.Firebase('https://blazing-fire-7386.firebaseio.com')
});
