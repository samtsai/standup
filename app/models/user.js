import DS from 'ember-data';

export default DS.Model.extend({
  provider: DS.attr('string'),
  name: DS.attr('string'),
  email: DS.attr('string'),
  created: DS.attr('date')
});
