/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - project_role');
  return Promise.join(
    knex('project_role').insert({role_cd: 'PI', description: 'Principal Investigator'})
  );
};
