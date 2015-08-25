/*eslint-disable camelcase */
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Inserts seed entries
    knex('disclosure_type').insert({type_cd: 1, description: 'Manual'}),
    knex('disclosure_type').insert({type_cd: 2, description: 'Annual'}),
    knex('disclosure_type').insert({type_cd: 3, description: 'Project'}),

    knex('disclosure_status').insert({status_cd: 1, description: 'In progress'}),
    knex('disclosure_status').insert({status_cd: 2, description: 'Routed for Review'}),
    knex('disclosure_status').insert({status_cd: 3, description: 'Approved'}),
    knex('disclosure_status').insert({status_cd: 4, description: 'Disapproved'}),

    knex('disposition_type').insert({type_cd: 1, description: '222'}),

    knex('fin_entity_type').insert({type_cd: 1, description: 'Large Corporation'}),

    knex('relationship_person_type').insert({type_cd: 1, description: 'Self'}),
    knex('relationship_person_type').insert({type_cd: 2, description: 'Spouse'}),
    knex('relationship_person_type').insert({type_cd: 5, description: 'Other'}),
    knex('relationship_person_type').insert({type_cd: 6, description: 'Entity'}),

    knex('relationship_type').insert({type_cd: 1, description: 'Ownership'}),
    knex('relationship_type').insert({type_cd: 2, description: 'Offices/Positions'}),
    knex('relationship_type').insert({type_cd: 3, description: 'Paid Activities'}),
    knex('relationship_type').insert({type_cd: 4, description: 'Intellectual Property'}),
    knex('relationship_type').insert({type_cd: 5, description: 'Other'}),

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
    knex('relationship_category_type').insert({type_cd: 11, description: 'Other Transactions'}),

    knex('relationship_amount_type').insert({type_cd: 1, description: '$1 - $5,000'}),
    knex('relationship_amount_type').insert({type_cd: 2, description: '$5,001 - $10,000'}),
    knex('relationship_amount_type').insert({type_cd: 3, description: 'Over $10,000'}),
    knex('relationship_amount_type').insert({type_cd: 4, description: 'Privately Held, no valuation'}),
    knex('relationship_amount_type').insert({type_cd: 5, description: 'Does not apply'}),

    knex('project_type').insert({type_cd: 1, description: 'Research'}),
    knex('project_type').insert({type_cd: 2, description: 'Administration'}),
    knex('project_type').insert({type_cd: 3, description: 'Resubmission'}),
    knex('project_type').insert({type_cd: 4, description: 'Classification'}),

    knex('project_role').insert({role_cd: 'PI', description: 'Principal Investigator'}),

    knex('relationship_status').insert({status_cd: 1, description: 'No Conflict'}),
    knex('relationship_status').insert({status_cd: 2, description: 'Potential Relationship'}),
    knex('relationship_status').insert({status_cd: 3, description: 'Managed Relationship'})
  );
};
