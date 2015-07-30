SET FOREIGN_KEY_CHECKS = 0;
SET GROUP_CONCAT_MAX_LEN=32768;
SET @tables = NULL;
SELECT GROUP_CONCAT('`', table_name, '`') INTO @tables
  FROM information_schema.tables
  WHERE table_schema = (SELECT DATABASE());
SELECT IFNULL(@tables,'dummy') INTO @tables;

SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);
PREPARE stmt FROM @tables;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS disclosure_type (
  type_cd INT NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (type_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS disclosure_status (
  status_cd INT NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (status_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS disposition_type (
  type_cd INT NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (type_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS disclosure (
  id INT NOT NULL AUTO_INCREMENT,    
  type_cd INT NOT NULL,
  title VARCHAR(200) NULL,
  disposition_type_cd INT NULL,
  status_cd INT NOT NULL,
  submitted_by VARCHAR(40) NULL,
  submitted_date DATETIME NULL,
  start_date DATETIME NOT NULL,
  expired_date DATETIME NULL,
  last_review_date DATETIME NULL,
  approved_date DATETIME NULL, 
  PRIMARY KEY (id),
  CONSTRAINT fk_disclosure_type
    FOREIGN KEY (type_cd)
    REFERENCES disclosure_type (type_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_disclosure_status
    FOREIGN KEY (status_cd)
    REFERENCES disclosure_status (status_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_disposition_type
    FOREIGN KEY (disposition_type_cd)
    REFERENCES disposition_type (type_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS fin_entity_type (
  type_cd INT NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (type_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS fin_entity (
  id INT NOT NULL AUTO_INCREMENT,
  disclosure_id INT NOT NULL,
  active BOOLEAN NULL,
  public BOOLEAN NULL,
  type_cd INT NULL,
  sponsor BOOLEAN NULL,
  name VARCHAR(200),
  description VARCHAR(200),
  INDEX fk_rel_disclosure_idx (disclosure_id ASC),
  PRIMARY KEY (id),
  CONSTRAINT fk_fin_entity_type
    FOREIGN KEY (type_cd)
    REFERENCES fin_entity_type (type_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_disclosure
    FOREIGN KEY (disclosure_id)
    REFERENCES disclosure (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS relationship_person_type (
  type_cd INT NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (type_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS relationship_type (
  type_cd INT NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (type_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS relationship_category_type (
  type_cd INT NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (type_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS relationship_amount_type (
  type_cd INT NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (type_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS relationship (
  id INT NOT NULL AUTO_INCREMENT,
  fin_entity_id INT NOT NULL,
  type_cd INT NULL,
  person_type_cd INT NOT NULL,
  relationship_category_cd INT NULL,
  amount_cd INT NULL,
  comments VARCHAR(4000) NULL,
  INDEX fk_fin_entity1_idx (fin_entity_id ASC),
  PRIMARY KEY (id),
  CONSTRAINT fk_fin_entity1
    FOREIGN KEY (fin_entity_id)
    REFERENCES fin_entity (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_relationship_type
    FOREIGN KEY (type_cd)
    REFERENCES relationship_type (type_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_relationship_person_type
    FOREIGN KEY (person_type_cd)
    REFERENCES relationship_person_type (type_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_relationship_category_type
    FOREIGN KEY (relationship_category_cd)
    REFERENCES relationship_category_type (type_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_relationship_amount_type
    FOREIGN KEY (amount_cd)
    REFERENCES relationship_amount_type (type_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS project_type (
  type_cd INT NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (type_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS project_role (
  role_cd VARCHAR(5) NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (role_cd)  
)
ENGINE = InnoDB;

-- sponsor_cd comes from an external system.  no fk constraint.
CREATE TABLE IF NOT EXISTS project (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  type_cd INT NOT NULL,
  role_cd VARCHAR(50) NOT NULL,
  sponsor_cd VARCHAR(6) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_project_type
    FOREIGN KEY (type_cd)
    REFERENCES project_type (type_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_project_role
    FOREIGN KEY (role_cd)
    REFERENCES project_role (role_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS relationship_status (
  status_cd INT NOT NULL,
  description VARCHAR(50) NOT NULL,
  PRIMARY KEY (status_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS declaration (
  id INT NOT NULL AUTO_INCREMENT,
  fin_entity_id INT NOT NULL,
  project_id INT NOT NULL,
  relationship_status_cd INT NOT NULL,
  comments VARCHAR(4000) NULL,
  INDEX fk_rel_entity2_idx (fin_entity_id ASC),
  INDEX fk_rel_project_idx (project_id ASC),
  PRIMARY KEY (id),
  CONSTRAINT fk_fin_entity2
    FOREIGN KEY (fin_entity_id)
    REFERENCES fin_entity (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_project
    FOREIGN KEY (project_id)
    REFERENCES project (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_relationship_status
    FOREIGN KEY (relationship_status_cd)
    REFERENCES relationship_status (status_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;
