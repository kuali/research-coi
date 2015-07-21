INSERT INTO coi.disclosure_status (status_cd, description) values (1, 'Update Required');
INSERT INTO coi.disclosure_status (status_cd, description) values (2, 'Incomplete');
INSERT INTO coi.disclosure_status (status_cd, description) values (3, 'Revision Necessary');
INSERT INTO coi.disclosure_status (status_cd, description) values (4, 'Approved');

INSERT INTO coi.disclosure_type (type_cd, description) values (1, 'Manual');
INSERT INTO coi.disclosure_type (type_cd, description) values (2, 'Annual');
INSERT INTO coi.disclosure_type (type_cd, description) values (3, 'Project');
INSERT INTO coi.disclosure_type (type_cd, description) values (4, 'Other');

INSERT INTO coi.disclosure (type_cd, title, submitted_date, disposition, start_date, expired_date, status_cd, last_review_date) 
VALUES (
2,
'Petroleum extraction in deep water',
CURDATE(),
'No Conflict Exists',
CURDATE(),
CURDATE(),
1,
CURDATE()
);

INSERT INTO coi.disclosure (type_cd, title, submitted_date, disposition, start_date, expired_date, status_cd, last_review_date) 
VALUES (
3,
'Glyphosate as a carcinogen',
CURDATE(),
'Relationship Identified',
CURDATE(),
CURDATE(),
2,
CURDATE()
);

INSERT INTO coi.disclosure (type_cd, title, submitted_date, disposition, start_date, expired_date, status_cd, last_review_date) 
VALUES (
2,
'Copper transformation rates',
CURDATE(),
'No Conflict Exists',
CURDATE(),
CURDATE(),
1,
CURDATE()
);

INSERT INTO coi.disclosure (type_cd, title, submitted_date, disposition, start_date, expired_date, status_cd, last_review_date)
VALUES (
2,
'Shocking bunnies for fun',
CURDATE(),
'Potential Relationship',
CURDATE(),
CURDATE(),
4,
CURDATE()
);

INSERT INTO coi.disclosure (type_cd, title, submitted_date, disposition, start_date, expired_date, status_cd, last_review_date) 
VALUES (
3,
'Pigeon navigation sources',
CURDATE(),
'Relationship Identified',
CURDATE(),
CURDATE(),
1,
CURDATE()
);

INSERT INTO coi.disclosure (type_cd, title, submitted_date, disposition, start_date, expired_date, status_cd, last_review_date) 
VALUES (
2,
'Investment strategies for Africa',
CURDATE(),
'No Conflict Exists',
CURDATE(),
CURDATE(),
1,
CURDATE()
);

INSERT INTO coi.disclosure (type_cd, title, submitted_date, disposition, start_date, expired_date, status_cd, last_review_date) 
VALUES (
3,
'Celery and peanut butter',
CURDATE(),
'Relationship Identified',
CURDATE(),
CURDATE(),
1,
CURDATE()
);
