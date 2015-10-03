/*eslint camelcase:0 */
let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let getFile = (dbInfo, path) => {
  let knex = getKnex(dbInfo);
  return knex.select('*').from('file').where('path', path);
};
