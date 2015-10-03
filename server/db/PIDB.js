/*eslint camelcase:0 */
let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

let queryUsingIndex = (knex, term) => {
  return knex.distinct('submitted_by as value')
    .from('disclosure as d')
    .andWhere('submitted_by', 'LIKE', term + '%')
    .limit(10);
};

let queryWithoutIndex = (knex, term) => {
  return knex.distinct('submitted_by as value')
    .from('disclosure as d')
    .andWhere('submitted_by', 'LIKE', '%' + term + '%')
    .limit(10);
};

export let getSuggestions = (dbInfo, term, callback) => {
  let knex = getKnex(dbInfo);

  queryUsingIndex(knex, term)
  .then(result =>{
    if (result.length < 10) {
      return queryWithoutIndex(knex, term).then(noIndexResult => {
        callback(undefined, noIndexResult);
      });
    }
    else {
      callback(undefined, result);
    }
  })
  .catch(err => {
    callback(err);
  });
};
