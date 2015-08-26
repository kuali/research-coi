/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - relationship_category_type');
  return Promise.join(
    knex('relationship_category_type').insert({type_cd: 1, description: 'Stock'}),
    knex('relationship_category_type').insert({type_cd: 2, description: 'Stock Options'}),
    knex('relationship_category_type').insert({type_cd: 3, description: 'Other Ownership'}),
    knex('relationship_category_type').insert({type_cd: 4, description: 'Board Member'}),
    knex('relationship_category_type').insert({type_cd: 5, description: 'Partner'}),
    knex('relationship_category_type').insert({type_cd: 6, description: 'Other Managerial Positions'}),
    knex('relationship_category_type').insert({type_cd: 7, description: 'Founder'}),
    knex('relationship_category_type').insert({type_cd: 8, description: 'Royalty Income'}),
    knex('relationship_category_type').insert({type_cd: 9, description: 'Intellectual Property Rights'}),
    knex('relationship_category_type').insert({type_cd: 10, description: 'Contract'}),
    knex('relationship_category_type').insert({type_cd: 11, description: 'Other Transactions'})
  );
};
