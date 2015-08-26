/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - relationship_status');
  return Promise.join(
    knex('relationship_status').insert({status_cd: 1, description: 'No Conflict'}),
    knex('relationship_status').insert({status_cd: 2, description: 'Potential Relationship'}),
    knex('relationship_status').insert({status_cd: 3, description: 'Managed Relationship'})
  );
};
