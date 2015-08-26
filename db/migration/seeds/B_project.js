/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - project');
  return Promise.join(
    knex('project').insert({
      name: 'Do Squirrels smile while eating peanut butter cups?',
      type_cd: 1,
      role_cd: 'PI',
      sponsor_cd: '00010'
    })
  );
};
