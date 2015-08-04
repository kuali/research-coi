exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('declaration').insert({
      fin_entity_id: knex.raw('(select max(id) from fin_entity)'),
      project_id: knex.raw('(select max(id) from project)'),
      relationship_status_cd: 1
    }),
    knex('relationship').insert({
      fin_entity_id: knex.raw('(select max(id) from fin_entity)'),
      type_cd: 1,
      person_type_cd: 1,
      relationship_category_cd: 1,
      amount_cd: 1,
      comments: 'Rel 1 Comments'
    }),
    knex('relationship').insert({
      fin_entity_id: knex.raw('(select max(id) from fin_entity)'),
      type_cd: 1,
      person_type_cd: 1,
      relationship_category_cd: 1,
      amount_cd: 1,
      comments: 'Rel 2 Comments'
    }),
    knex('relationship').insert({
      fin_entity_id: knex.raw('(select max(id) from fin_entity)'),
      type_cd: 2,
      person_type_cd: 2,
      relationship_category_cd: 2,
      amount_cd: 2,
      comments: 'Rel 3 Comments'
    })
  );
};
