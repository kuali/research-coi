INSERT INTO disclosure_type (type_cd, description) values (1, 'Manual');
INSERT INTO disclosure_type (type_cd, description) values (2, 'Annual');
INSERT INTO disclosure_type (type_cd, description) values (3, 'Project');

INSERT INTO disclosure_status (status_cd, description) values (1, 'In progress');
INSERT INTO disclosure_status (status_cd, description) values (2, 'Routed for Review');
INSERT INTO disclosure_status (status_cd, description) values (3, 'Approved');
INSERT INTO disclosure_status (status_cd, description) values (4, 'Disapproved');

INSERT INTO disposition_type (type_cd, description) values (1, '222');

INSERT INTO fin_entity_type (type_cd, description) values (1, 'Large Corporation');

INSERT INTO relationship_person_type (type_cd, description) values (1, 'Self');
INSERT INTO relationship_person_type (type_cd, description) values (2, 'Spouse');
INSERT INTO relationship_person_type (type_cd, description) values (5, 'Other');
INSERT INTO relationship_person_type (type_cd, description) values (6, 'Entity');

INSERT INTO relationship_type (type_cd, description) values (1, 'Ownership');
INSERT INTO relationship_type (type_cd, description) values (2, 'Offices/Positions');
INSERT INTO relationship_type (type_cd, description) values (3, 'Paid Activities');
INSERT INTO relationship_type (type_cd, description) values (4, 'Intellectual Property');
INSERT INTO relationship_type (type_cd, description) values (5, 'Other');

INSERT INTO relationship_category_type (type_cd, description) values (1, 'Stock');
INSERT INTO relationship_category_type (type_cd, description) values (2, 'Stock Options');
INSERT INTO relationship_category_type (type_cd, description) values (3, 'Other Ownership');
INSERT INTO relationship_category_type (type_cd, description) values (4, 'Board Member');
INSERT INTO relationship_category_type (type_cd, description) values (5, 'Partner');
INSERT INTO relationship_category_type (type_cd, description) values (6, 'Other Managerial Positions');
INSERT INTO relationship_category_type (type_cd, description) values (7, 'Founder');
INSERT INTO relationship_category_type (type_cd, description) values (8, 'Royalty Income');
INSERT INTO relationship_category_type (type_cd, description) values (9, 'Intellectual Property Rights');
INSERT INTO relationship_category_type (type_cd, description) values (10, 'Contract');
INSERT INTO relationship_category_type (type_cd, description) values (11, 'Other Transactions');

INSERT INTO relationship_amount_type (type_cd, description) values (1, '$1 - $5,000');
INSERT INTO relationship_amount_type (type_cd, description) values (2, '$5,001 - $10,000');
INSERT INTO relationship_amount_type (type_cd, description) values (3, 'Over $10,000');
INSERT INTO relationship_amount_type (type_cd, description) values (4, 'Privately Held, no valuation');
INSERT INTO relationship_amount_type (type_cd, description) values (5, 'Does not apply');

INSERT INTO project_type (type_cd, description) values (1, 'Research');
INSERT INTO project_type (type_cd, description) values (2, 'Administration');
INSERT INTO project_type (type_cd, description) values (3, 'Resubmission');
INSERT INTO project_type (type_cd, description) values (4, 'Classification');

INSERT INTO project_role (role_cd, description) values ('PI', 'Principal Investigator');

INSERT INTO relationship_status (status_cd, description) values (1, 'No Conflict');
INSERT INTO relationship_status (status_cd, description) values (2, 'Potential Relationship');
INSERT INTO relationship_status (status_cd, description) values (3, 'Managed Relationship');