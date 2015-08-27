/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - disclosure');
  return Promise.join(
    knex('disclosure').insert({
      type_cd: 2,
      title: 'Petroleum extraction in deep water',
      submitted_date: new Date(),
      disposition_type_cd: 1,
      start_date: new Date(),
      expired_date: new Date(),
      status_cd: 1,
      last_review_date: new Date(),
      approved_date: new Date()
    }),
    knex('disclosure').insert({
      type_cd: 3,
      title: 'Celery and peanut butter',
      submitted_date: new Date(),
      disposition_type_cd: 1,
      start_date: new Date(),
      expired_date: new Date(),
      status_cd: 1,
      last_review_date: new Date(),
      approved_date: new Date()
    }),
    knex('disclosure').insert({
      type_cd: 2,
      title: 'Investment strategies for Africa',
      submitted_date: new Date(),
      disposition_type_cd: 1,
      start_date: new Date(),
      expired_date: new Date(),
      status_cd: 1,
      last_review_date: new Date(),
      approved_date: new Date()
    }),
    knex('disclosure').insert({
      type_cd: 3,
      title: 'Pigeon navigation sources',
      submitted_date: new Date(),
      disposition_type_cd: 1,
      start_date: new Date(),
      expired_date: new Date(),
      status_cd: 1,
      last_review_date: new Date(),
      approved_date: new Date()
    }),
    knex('disclosure').insert({
      type_cd: 2,
      title: 'Effect of electromagnetic resonance',
      submitted_date: new Date(),
      disposition_type_cd: 1,
      start_date: new Date(),
      expired_date: new Date(),
      status_cd: 1,
      last_review_date: new Date(),
      approved_date: new Date()
    }),
    knex('disclosure').insert({
      type_cd: 2,
      title: 'Copper transformation rates',
      submitted_date: new Date(),
      disposition_type_cd: 1,
      start_date: new Date(),
      expired_date: new Date(),
      status_cd: 1,
      last_review_date: new Date(),
      approved_date: new Date()
    }),
    knex('disclosure').insert({
      type_cd: 3,
      title: 'Glyphosate as a carcinogen',
      submitted_date: new Date(),
      disposition_type_cd: 1,
      start_date: new Date(),
      expired_date: new Date(),
      status_cd: 2,
      last_review_date: new Date(),
      approved_date: new Date()
    })
  );
};
