/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - fin_entity');
  return Promise.join(
    knex('fin_entity').insert({
      disclosure_id: knex('disclosure').max('id'),
      active: true,
      public: true,
      type_cd: 1,
      sponsor: true,
      name: 'Apple',
      description: 'Entity 1 - Petroleum extraction in deep water'
    }),
    knex('fin_entity').insert({
      disclosure_id: knex('disclosure').max('id'),
      active: false,
      public: true,
      type_cd: 1,
      sponsor: true,
      name: 'Pfizer',
      description: 'Entity 2 - Petroleum extraction in deep water'
    }),
    knex('fin_entity').insert({
      disclosure_id: knex('disclosure').max('id'),
      active: false,
      public: true,
      type_cd: 1,
      sponsor: false,
      name: 'Johnson & Johnson',
      description: 'Entity 3 - Petroleum extraction in deep water'
    }),
    knex('fin_entity').insert({
      disclosure_id: knex('disclosure').max('id'),
      active: false,
      public: false,
      type_cd: 1,
      sponsor: false,
      name: 'PepsiCo',
      description: 'Entity 4 - Petroleum extraction in deep water'
    }),
    knex('fin_entity').insert({
      disclosure_id: knex('disclosure').max('id'),
      active: true,
      public: true,
      type_cd: 1,
      sponsor: true,
      name: 'Rockwell Collins',
      description: 'Entity 1 - Glyphosate as a carcinogen'
    })
  );
};
