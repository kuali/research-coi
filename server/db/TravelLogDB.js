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
  return query.select('fe.name as entityName', 'tr.amount', 'tr.start_date as startDate', 'tr.end_date as endDate', 'tr.destination', 'tr.reason')
    .from('travel_relationship as t')
    .innerJoin('relationship a r', 'r.id', 'tr.relationship_id' )
    .innerJoin('fin_entity as fe', 'fe.id', 'r.fin_entity_id')
    .orderBy('fe.name', 'ASC');
};
