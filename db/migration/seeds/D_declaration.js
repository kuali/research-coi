/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - declaration');
  return Promise.join(
    knex('declaration').insert({
      fin_entity_id: knex('fin_entity').max('id'),
      project_id: knex('project').max('id'),
      relationship_status_cd: 1
    })
  );
};
