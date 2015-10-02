/*eslint camelcase:0 */
let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let getFile = (dbInfo, path, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('*').from('file').where('path', path).then(result=>{
    callback(undefined, result);
  })
  .catch(err => {
    callback(err);
  });
};
