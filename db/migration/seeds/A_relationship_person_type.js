/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - relationship_person_type');
  return Promise.join(
    knex('relationship_person_type').insert({type_cd: 1, description: 'Self'}),
    knex('relationship_person_type').insert({type_cd: 2, description: 'Spouse'}),
    knex('relationship_person_type').insert({type_cd: 5, description: 'Other'}),
    knex('relationship_person_type').insert({type_cd: 6, description: 'Entity'})
  );
};
