INSERT INTO disclosure (type_cd, title, submitted_date, disposition_type_cd, start_date, expired_date, status_cd, last_review_date, approved_date) 
VALUES (
2,
'Petroleum extraction in deep water',
CURDATE(),
1,
CURDATE(),
CURDATE(),
1,
CURDATE(),
CURDATE()
);

INSERT INTO fin_entity (disclosure_id, active, public, type_cd, sponsor, description) VALUES (
(select max(id) from disclosure),
true,
true,
1,
true,
'Entity 1 - Petroleum extraction in deep water'
);

INSERT INTO relationship (fin_entity_id, type_cd, person_type_cd, relationship_category_cd, amount_cd, comments) VALUES (
(select max(id) from fin_entity),
1,
1,
1,
1,
'Rel 1 - Comments Comments'
);

INSERT INTO relationship (fin_entity_id, type_cd, person_type_cd, relationship_category_cd, amount_cd, comments) VALUES (
(select max(id) from fin_entity),
2,
2,
2,
2,
'Rel 2 - Comments Comments More Comments'
);

INSERT INTO project (name, type_cd, role_cd, sponsor_cd) VALUES (
'Do Squirrels smile while eating peanut butter cups?',
1,
'PI',
'00010' 
);
  
INSERT INTO declaration (fin_entity_id, project_id, relationship_status_cd) VALUES (
(select max(id) from fin_entity),
(select max(id) from project),
1
);

INSERT INTO fin_entity (disclosure_id, active, public, type_cd, sponsor, description) VALUES (
(select max(id) from disclosure),
false,
true,
1,
true,
'Entity 2 - Petroleum extraction in deep water'
);

INSERT INTO relationship (fin_entity_id, type_cd, person_type_cd, relationship_category_cd, amount_cd, comments) VALUES (
(select max(id) from fin_entity),
1,
1,
1,
1,
'Rel 1 Comments Comments'
);

INSERT INTO fin_entity (disclosure_id, active, public, type_cd, sponsor, description) VALUES (
(select max(id) from disclosure),
false,
true,
1,
false,
'Entity 3 - Petroleum extraction in deep water'
);

INSERT INTO fin_entity (disclosure_id, active, public, type_cd, sponsor, description) VALUES (
(select max(id) from disclosure),
false,
false,
1,
false,
'Entity 4 - Petroleum extraction in deep water'
);

INSERT INTO disclosure (type_cd, title, submitted_date, disposition_type_cd, start_date, expired_date, status_cd, last_review_date, approved_date) 
VALUES (
3,
'Glyphosate as a carcinogen',
CURDATE(),
1,
CURDATE(),
CURDATE(),
2,
CURDATE(),
CURDATE()
);

INSERT INTO fin_entity (disclosure_id, active, public, type_cd, sponsor, description) VALUES (
(select max(id) from disclosure),
true,
true,
1,
true,
'Entity 1 - Glyphosate as a carcinogen'
);

INSERT INTO disclosure (type_cd, title, submitted_date, disposition_type_cd, start_date, expired_date, status_cd, last_review_date, approved_date) 
VALUES (
2,
'Copper transformation rates',
CURDATE(),
1,
CURDATE(),
CURDATE(),
1,
CURDATE(),
CURDATE()
);

INSERT INTO disclosure (type_cd, title, submitted_date, disposition_type_cd, start_date, expired_date, status_cd, last_review_date, approved_date)
VALUES (
2,
'Shocking bunnies for fun',
CURDATE(),
1,
CURDATE(),
CURDATE(),
4,
CURDATE(),
CURDATE()
);

INSERT INTO disclosure (type_cd, title, submitted_date, disposition_type_cd, start_date, expired_date, status_cd, last_review_date, approved_date) 
VALUES (
3,
'Pigeon navigation sources',
CURDATE(),
1,
CURDATE(),
CURDATE(),
1,
CURDATE(),
CURDATE()
);

INSERT INTO disclosure (type_cd, title, submitted_date, disposition_type_cd, start_date, expired_date, status_cd, last_review_date, approved_date) 
VALUES (
2,
'Investment strategies for Africa',
CURDATE(),
1,
CURDATE(),
CURDATE(),
1,
CURDATE(),
CURDATE()
);

INSERT INTO disclosure (type_cd, title, submitted_date, disposition_type_cd, start_date, expired_date, status_cd, last_review_date, approved_date) 
VALUES (
3,
'Celery and peanut butter',
CURDATE(),
1,
CURDATE(),
CURDATE(),
1,
CURDATE(),
CURDATE()
);
