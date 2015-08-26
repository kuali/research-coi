/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - fin_entity_type');
  return Promise.join(
    knex('fin_entity_type').insert({type_cd: 1, description: 'Large Corporation'})
  );
};
