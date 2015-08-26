/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - disclosure_type');
  return Promise.join(
    knex('disclosure_type').insert({type_cd: 1, description: 'Manual'}),
    knex('disclosure_type').insert({type_cd: 2, description: 'Annual'}),
    knex('disclosure_type').insert({type_cd: 3, description: 'Project'})
  );
};
