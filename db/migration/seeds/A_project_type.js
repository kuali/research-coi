/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - project_type');
  return Promise.join(
    knex('project_type').insert({type_cd: 1, description: 'Research'}),
    knex('project_type').insert({type_cd: 2, description: 'Administration'}),
    knex('project_type').insert({type_cd: 3, description: 'Resubmission'}),
    knex('project_type').insert({type_cd: 4, description: 'Classification'})
  );
};
