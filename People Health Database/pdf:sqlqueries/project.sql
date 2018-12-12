/*Name: Helen Jiang
Date: 10/7/18
Project Step 2: SQL file that creates all of the tables with added sample values
*/


CREATE TABLE Disease(
    diseaseID int(11) NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    lifestyleInfluence tinyint(1) NOT NULL, 
    hereditary tinyint(1) NOT NULL,
    medicine varchar(100) NOT NULL,
    PRIMARY KEY (diseaseID)

)ENGINE = InnoDB;


CREATE TABLE Continent(
    continentID int(11) NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    climate varchar(100) NOT NULL,
    publicHealth varchar(100) NOT NULL,
    population bigint(20),
    diseaseID int(11) DEFAULT NULL,
    PRIMARY KEY (continentID),
    CONSTRAINT fk_disease FOREIGN KEY (diseaseID) REFERENCES Disease(diseaseID)  ON DELETE SET NULL


)ENGINE = InnoDB;


CREATE TABLE People(
    personID int(11) NOT NULL AUTO_INCREMENT,
    fname varchar(100) NOT NULL,
    lname varchar(100) NOT NULL,
    birthdate date NOT NULL,
    currentContinent int(11),
    PRIMARY KEY (personID),
    CONSTRAINT fk_continent FOREIGN KEY (currentContinent) REFERENCES Continent(continentID) ON DELETE SET NULL

)ENGINE = InnoDB;


CREATE TABLE Status(
    statusID int(11) NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    explanation varchar(100) NOT NULL,
    diseaseID int(11),
    PRIMARY KEY (statusID),
    CONSTRAINT fk_diseaseID FOREIGN KEY (diseaseID) REFERENCES Disease(diseaseID) ON DELETE SET NULL
)ENGINE = InnoDB;


CREATE TABLE People_status(
    psID int(11) NOT NULL AUTO_INCREMENT,
    personID int(11),
    statusID int(11),
    dateAdded date NOT NULL,
    PRIMARY KEY (psID),
    CONSTRAINT fk_personID_ps FOREIGN KEY (personID) REFERENCES People(personID) ON DELETE SET NULL,
    CONSTRAINT fk_statusID_ps FOREIGN KEY (statusID) REFERENCES Status(statusID) ON DELETE SET NULL

)ENGINE = InnoDB;




INSERT INTO `Disease` (`diseaseID`, `name`, `lifestyleInfluence`, `hereditary`, `medicine`) 
VALUES ('1', 'diabetes', '1', '1', 'glipizide'), 
(NULL, 'lupus', '0', '1', 'antibiotic'),
(NULL, 'tuberculosis', '1', '1', 'antibiotic');

INSERT INTO `Continent` (`continentID`, `name`, `climate`, `publicHealth`, `population`, `diseaseID`) 
VALUES ('1', 'Strouland', 'wet', 'normal', '300000', NULL), 
(NULL, 'Grassland', 'dry', 'normal', '600000', NULL), 
(NULL, 'Asunland', 'cold', 'clean', '100000', NULL),
(NULL, 'Tisland', 'hot', 'dirty', '100000', NULL),
(NULL, 'Hisland', 'tropical', 'dirty', '100000', NULL),
(NULL, 'Tunland', 'cold', 'clean', '100000', NULL),
(NULL, 'Poshland', 'dry', 'clean', '100000', NULL);

INSERT INTO `People` (`personID`, `fname`, `lname`, `birthdate`, `currentContinent`) 
VALUES ('1', 'Helen', 'Jiang', '1994-10-07', '1'),
(NULL, 'Sam', 'Tesla', '1998-10-16', '2'), 
(NULL, 'Tessa', 'Fown', '1986-07-11', '1');

INSERT INTO `Status` (`statusID`, `name`, `explanation`, `diseaseID`)
VALUES (NULL, 'cured', 'due to medication', '1'), 
(NULL, 'death', 'due to disease', '2'), 
(NULL, 'death', 'due to old age', NULL);


INSERT INTO `People_status` (`psID`, `personID`, `statusID`, `dateAdded`) 
VALUES (NULL, '1', '1', '2018-11-19'),
(NULL, '2', '1', '2017-11-12');




