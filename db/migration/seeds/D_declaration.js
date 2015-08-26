/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - declaration');
  return Promise.join(
    knex('declaration').insert({
      fin_entity_id: knex.raw('(select max(id) from fin_entity)'),
      project_id: knex.raw('(select max(id) from project)'),
      relationship_status_cd: 1
    })
  );
};
