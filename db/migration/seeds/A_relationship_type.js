/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - relationship_type');
  return Promise.join(
    knex('relationship_type').insert({type_cd: 1, description: 'Ownership'}),
    knex('relationship_type').insert({type_cd: 2, description: 'Offices/Positions'}),
    knex('relationship_type').insert({type_cd: 3, description: 'Paid Activities'}),
    knex('relationship_type').insert({type_cd: 4, description: 'Intellectual Property'}),
    knex('relationship_type').insert({type_cd: 5, description: 'Other'})
  );
};
