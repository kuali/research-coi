/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - fin_entity');
  return Promise.join(
    knex('fin_entity').insert({
      disclosure_id: knex.raw('(select max(id) from disclosure)'),
      active: true,
      public: true,
      type_cd: 1,
      sponsor: true,
      description: 'Entity 1 - Petroleum extraction in deep water'
    }),
    knex('fin_entity').insert({
      disclosure_id: knex.raw('(select max(id) from disclosure)'),
      active: false,
      public: true,
      type_cd: 1,
      sponsor: true,
      description: 'Entity 2 - Petroleum extraction in deep water'
    }),
    knex('fin_entity').insert({
      disclosure_id: knex.raw('(select max(id) from disclosure)'),
      active: false,
      public: true,
      type_cd: 1,
      sponsor: false,
      description: 'Entity 3 - Petroleum extraction in deep water'
    }),
    knex('fin_entity').insert({
      disclosure_id: knex.raw('(select max(id) from disclosure)'),
      active: false,
      public: false,
      type_cd: 1,
      sponsor: false,
      description: 'Entity 4 - Petroleum extraction in deep water'
    }),
    knex('fin_entity').insert({
      disclosure_id: knex.raw('(select max(id) from disclosure)'),
      active: true,
      public: true,
      type_cd: 1,
      sponsor: true,
      description: 'Entity 1 - Glyphosate as a carcinogen'
    })
  );
};
