/*eslint-disable camelcase */

exports.seed = function(knex, Promise) {
  console.log('Seed - disclosure_status');
  return Promise.join(
    knex('disclosure_status').insert({status_cd: 1, description: 'In progress'}),
    knex('disclosure_status').insert({status_cd: 2, description: 'Routed for Review'}),
    knex('disclosure_status').insert({status_cd: 3, description: 'Approved'}),
    knex('disclosure_status').insert({status_cd: 4, description: 'Disapproved'})
  );
};
