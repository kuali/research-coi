/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - fin_entity_type');
  return Promise.join(
    knex('fin_entity_type').insert({type_cd: 1, description: 'State Government'}),
    knex('fin_entity_type').insert({type_cd: 2, description: 'County Government'}),
    knex('fin_entity_type').insert({type_cd: 3, description: 'Small Business'}),
    knex('fin_entity_type').insert({type_cd: 4, description: 'For-profit Organization'}),
    knex('fin_entity_type').insert({type_cd: 5, description: 'Individual'})
  );
};
