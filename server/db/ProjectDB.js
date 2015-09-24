/*eslint camelcase:0 */
let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let getProjects = (dbInfo, userId, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('id', 'name', 'type_cd', 'role_cd', 'sponsor_cd').from('project').where({
    user_id: userId
  }).then(result =>{
    callback(undefined, result);
  })
  .catch(err => {
    callback(err);
  });
};
