/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - relationship');
  return Promise.join(
    knex('relationship').insert({
      fin_entity_id: knex('fin_entity').max('id'),
      type_cd: 1,
      person_type_cd: 1,
      relationship_category_cd: 1,
      amount_cd: 1,
      comments: 'Rel 1 Comments'
    }),
    knex('relationship').insert({
      fin_entity_id: knex('fin_entity').max('id'),
      type_cd: 1,
      person_type_cd: 1,
      relationship_category_cd: 1,
      amount_cd: 1,
      comments: 'Rel 2 Comments'
    }),
    knex('relationship').insert({
      fin_entity_id: knex('fin_entity').max('id'),
      type_cd: 2,
      person_type_cd: 2,
      relationship_category_cd: 2,
      amount_cd: 2,
      comments: 'Rel 3 Comments'
    })
  );
};
