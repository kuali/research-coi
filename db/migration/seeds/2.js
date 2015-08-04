exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    // knex('table_name').del(),

    // Inserts seed entries
    knex('disclosure').insert({
      type_cd: 2,
      title: 'Petroleum extraction in deep water',
      submitted_date: knex.raw('CURDATE()'),
      disposition_type_cd: 1,
      start_date: knex.raw('CURDATE()'),
      expired_date: knex.raw('CURDATE()'),
      status_cd: 1,
      last_review_date: knex.raw('CURDATE()'),
      approved_date: knex.raw('CURDATE()')
    }),
    knex('disclosure').insert({
      type_cd: 3,
      title: 'Celery and peanut butter',
      submitted_date: knex.raw('CURDATE()'),
      disposition_type_cd: 1,
      start_date: knex.raw('CURDATE()'),
      expired_date: knex.raw('CURDATE()'),
      status_cd: 1,
      last_review_date: knex.raw('CURDATE()'),
      approved_date: knex.raw('CURDATE()')
    }),
    knex('disclosure').insert({
      type_cd: 2,
      title: 'Investment strategies for Africa',
      submitted_date: knex.raw('CURDATE()'),
      disposition_type_cd: 1,
      start_date: knex.raw('CURDATE()'),
      expired_date: knex.raw('CURDATE()'),
      status_cd: 1,
      last_review_date: knex.raw('CURDATE()'),
      approved_date: knex.raw('CURDATE()')
    }),
    knex('disclosure').insert({
      type_cd: 3,
      title: 'Pigeon navigation sources',
      submitted_date: knex.raw('CURDATE()'),
      disposition_type_cd: 1,
      start_date: knex.raw('CURDATE()'),
      expired_date: knex.raw('CURDATE()'),
      status_cd: 1,
      last_review_date: knex.raw('CURDATE()'),
      approved_date: knex.raw('CURDATE()')
    }),
    knex('disclosure').insert({
      type_cd: 2,
      title: 'Effect of electromagnetic resonance',
      submitted_date: knex.raw('CURDATE()'),
      disposition_type_cd: 1,
      start_date: knex.raw('CURDATE()'),
      expired_date: knex.raw('CURDATE()'),
      status_cd: 1,
      last_review_date: knex.raw('CURDATE()'),
      approved_date: knex.raw('CURDATE()')
    }),
    knex('disclosure').insert({
      type_cd: 2,
      title: 'Copper transformation rates',
      submitted_date: knex.raw('CURDATE()'),
      disposition_type_cd: 1,
      start_date: knex.raw('CURDATE()'),
      expired_date: knex.raw('CURDATE()'),
      status_cd: 1,
      last_review_date: knex.raw('CURDATE()'),
      approved_date: knex.raw('CURDATE()')
    }),
    knex('disclosure').insert({
      type_cd: 3,
      title: 'Glyphosate as a carcinogen',
      submitted_date: knex.raw('CURDATE()'),
      disposition_type_cd: 1,
      start_date: knex.raw('CURDATE()'),
      expired_date: knex.raw('CURDATE()'),
      status_cd: 2,
      last_review_date: knex.raw('CURDATE()'),
      approved_date: knex.raw('CURDATE()')
    }),
    knex('project').insert({
      name: 'Do Squirrels smile while eating peanut butter cups?',
      type_cd: 1,
      role_cd: 'PI',
      sponsor_cd: '00010'
    }),
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
