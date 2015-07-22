drop schema if exists coi;
CREATE SCHEMA IF NOT EXISTS coi DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ;
USE coi ;

CREATE TABLE IF NOT EXISTS coi.disclosure_type (
  type_cd INT NOT NULL,
  description VARCHAR(50),
  PRIMARY KEY (type_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS coi.disclosure_status (
  status_cd INT NOT NULL,
  description VARCHAR(50),
  PRIMARY KEY (status_cd)  
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS coi.disclosure (
  id INT NOT NULL AUTO_INCREMENT,
  submitted_date DATETIME NULL,
  type_cd INT NOT NULL,
  title VARCHAR(200) NULL,
  disposition VARCHAR(45) NULL,
  start_date DATETIME NOT NULL,
  expired_date DATETIME NULL,
  status_cd INT NOT NULL,
  last_review_date DATETIME NULL, 
  PRIMARY KEY (id),
    CONSTRAINT fk_disclosure_type
    FOREIGN KEY (type_cd)
    REFERENCES coi.disclosure_type (type_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_disclosure_status
    FOREIGN KEY (status_cd)
    REFERENCES coi.disclosure_status (status_cd)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;
