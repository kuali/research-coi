/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - disposition_type');
  return Promise.join(
    knex('disposition_type').insert({type_cd: 1, description: '222'})
  );
};
