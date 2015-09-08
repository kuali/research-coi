/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  console.log('Seed - relationship_type');
  return Promise.join(
    knex('relationship_type')
    .insert({type_cd: 1, description: 'Ownership'})
    .then(function(){
      return Promise.join(
      knex('relationship_category_type').insert({type_cd: 1, relationship_type_cd: 1, description: 'Stock'}),
      knex('relationship_category_type').insert({type_cd: 2, relationship_type_cd: 1, description: 'Stock Options'}),
      knex('relationship_category_type').insert({type_cd: 3, relationship_type_cd: 1, description: 'Other Ownership'}));
    }),
    knex('relationship_type').insert({type_cd: 2, description: 'Offices/Positions'})
    .then(function() {
      return Promise.join(
      knex('relationship_category_type').insert({type_cd: 4, relationship_type_cd: 2, description: 'Board Member'}),
      knex('relationship_category_type').insert({type_cd: 5, relationship_type_cd: 2, description: 'Partner'}),
      knex('relationship_category_type').insert({type_cd: 6, relationship_type_cd: 2, description: 'Other Managerial Positions'}),
      knex('relationship_category_type').insert({type_cd: 7, relationship_type_cd: 2, description: 'Founder'}));
    }),
    knex('relationship_type').insert({type_cd: 3, description: 'Paid Activities'}),
    knex('relationship_type').insert({type_cd: 4, description: 'Intellectual Property'})
    .then(function() {
      return Promise.join(
      knex('relationship_category_type').insert({type_cd: 8, relationship_type_cd: 4, description: 'Royalty Income'}),
      knex('relationship_category_type').insert({type_cd: 9, relationship_type_cd: 4, description: 'Intellectual Property Rights'}));
    }),
    knex('relationship_type').insert({type_cd: 5, description: 'Other'})
    .then(function() {
      return Promise.join(
      knex('relationship_category_type').insert({type_cd: 10, relationship_type_cd: 5, description: 'Contract'}),
      knex('relationship_category_type').insert({type_cd: 11, relationship_type_cd: 5, description: 'Other Transactions'}));
    })
  );
};
