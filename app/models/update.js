import DS from 'ember-data';

export default DS.Model.extend({
  author: DS.attr('string'),
  update: DS.attr('string')
});
