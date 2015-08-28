/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - travel_log_entry');
  return Promise.join(
  knex('travel_log_entry').insert({
    fin_entity_id: 1,
    amount: 1000.00,
    destination: 'Hilo, HI',
    start_date: new Date(2015, 4, 2),
    end_date: new Date(2015, 4, 5),
    reason: 'To give a talk on dark matter'
  }),
  knex('travel_log_entry').insert({
    fin_entity_id: 2,
    amount: 2000.00,
    destination: 'Atlanta, GA',
    start_date: new Date(2015, 4, 13),
    end_date: new Date(2015, 4, 16),
    reason: 'To give a talk on quasars'
  }),
  knex('travel_log_entry').insert({
    fin_entity_id: 3,
    amount: 3000.00,
    destination: 'Atlanta, GA',
    start_date: new Date(2015, 7, 1),
    end_date: new Date(2015, 7, 3),
    reason: 'To give a talk on string theory'
  })
  );
};
