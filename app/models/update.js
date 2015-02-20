import DS from 'ember-data';

export default DS.Model.extend({
  author: DS.attr('string'),
  status: DS.attr('string'),
  date: DS.attr('date')
});
