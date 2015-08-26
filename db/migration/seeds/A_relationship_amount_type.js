/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - relationship_amount_type');
  return Promise.join(
    knex('relationship_amount_type').insert({type_cd: 1, description: '$1 - $5,000'}),
    knex('relationship_amount_type').insert({type_cd: 2, description: '$5,001 - $10,000'}),
    knex('relationship_amount_type').insert({type_cd: 3, description: 'Over $10,000'}),
    knex('relationship_amount_type').insert({type_cd: 4, description: 'Privately Held, no valuation'}),
    knex('relationship_amount_type').insert({type_cd: 5, description: 'Does not apply'})
  );
};
