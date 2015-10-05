let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let getTravelLogEntries = (dbInfo, userId, optionalTrx) => {
  let knex = getKnex(dbInfo);

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  return query.select('fe.name as entityName', 'tle.amount', 'tle.start_date as startDate', 'tle.end_date as endDate', 'tle.destination', 'tle.reason')
    .from('travel_log_entry as tle')
    .innerJoin('fin_entity as fe', 'fe.id', 'tle.fin_entity_id')
    .orderBy('fe.name', 'ASC');
};
