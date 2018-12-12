/*Name: Helen Jiang
Date: 11/20/18
Project Step 3: SQL file that gives sample data_manipulation queries
*/


---------------------------------------------------------------------------
-- Queries for Disease Entity, including select, insert, delete, update --
--------------------------------------------------------------------------
SELECT diseaseID, name, lifestyleInfluence, hereditary, medicine FROM Disease;

--insert and delete--
INSERT INTO Disease (name, hereditary, lifestyleInfluence, medicine) VALUES (?, ?, ?, ?);
DELETE FROM Disease WHERE diseaseID = ?;

-- selecting one disease to update that specific one by ID --
SELECT diseaseID AS id, name, lifestyleInfluence, hereditary, medicine FROM Disease WHERE diseaseID = ?;
UPDATE Disease SET name=?,  lifestyleInfluence=?, hereditary=?, medicine=? WHERE diseaseID=?;





---------------------------------------------------------------------------
-- Queries for Continent Entity, including select, insert, delete, update --
--------------------------------------------------------------------------
SELECT c.continentID, c.name, c.climate, c.publicHealth, c.population, d.name AS diseaseName FROM Continent c 
LEFT JOIN Disease d ON c.diseaseID = d.diseaseID
ORDER BY c.name;

--dropdown disease menu--
SELECT diseaseID, name FROM Disease ORDER BY name;

--insert and delete--
INSERT INTO Continent (name, climate, publicHealth, population, diseaseID) VALUES (?,?,?,?, ?);
DELETE FROM Continent WHERE continentID = ?;


--update one disease--
SELECT c.continentID AS id, c.name, c.climate, c.publicHealth, c.population, d.name AS diseaseName, d.diseaseID FROM Continent c 
LEFT JOIN Disease d ON c.diseaseID = d.diseaseID 
WHERE c.continentID =?;
UPDATE Continent SET name=?, climate=?, publicHealth=?, population=?, diseaseID=? WHERE continentID=?;




---------------------------------------------------------------------------
-- Queries for Status Entity, including select, insert, delete, update --
--------------------------------------------------------------------------
SELECT s.statusID, s.name, s.explanation, d.diseaseID, d.name AS diseaseName FROM Status s 
LEFT JOIN Disease d ON d.diseaseID = s.diseaseID 
ORDER BY s.name;

--dropdown disease menu--
SELECT diseaseID, name FROM Disease ORDER BY name;

--insert and delete--
INSERT INTO Status (name, explanation, diseaseID) VALUES (?,?,?);
DELETE FROM Status WHERE statusID = ?;

--updating one status--
SELECT s.statusID, s.name, s.explanation, d.diseaseID, d.name AS diseaseName FROM Status s 
LEFT JOIN Disease d ON d.diseaseID = s.diseaseID 
WHERE s.statusID=?;

UPDATE Status SET name=?, explanation=?, diseaseID=? WHERE statusID=?;




---------------------------------------------------------------------------
-- Queries for People Entity, including select, insert, delete, update --
--------------------------------------------------------------------------
SELECT p.personID, p.fname, p.lname, p.birthdate, c.name AS currentContinent FROM People p 
LEFT JOIN Continent c ON p.currentContinent= c.continentID 
ORDER BY p.lname;

--dropdown continent menu--
SELECT continentID, name FROM Continent ORDER BY name;

--delete and insert --
INSERT INTO People (fname, lname, birthdate, currentContinent) VALUES (?,?,?,?);
DELETE FROM People WHERE personID = ?;

--updating one person--
SELECT p.personID, p.fname, p.lname, p.birthdate, c.name AS currentContinent, c.continentID FROM People p 
LEFT JOIN Continent c ON p.currentContinent= c.continentID 
WHERE p.personID =?;

UPDATE People SET fname=?, lname=?, birthdate=?, currentContinent=? WHERE personID=?;




--------------------------------------------------------------------------------
-- Queries for People_status Entity, including select, insert, delete, update --
--------------------------------------------------------------------------------

SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps 
INNER JOIN People p ON ps.personID = p.personID 
INNER JOIN Status s ON ps.statusID = s.statusID 
LEFT JOIN Disease d ON s.diseaseID = d.diseaseID Order BY p.lname; 


--For the drop down select menus--
SELECT personID, fname, lname FROM People ORDER BY lname;
SELECT s.statusID, s.name, s.explanation, s.diseaseID, d.name AS diseaseName FROM Status s LEFT JOIN Disease d ON d.diseaseID = s.diseaseID ORDER BY s.name;

--For filtering by people/status/date --
SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps 
INNER JOIN People p ON ps.personID = p.personID 
INNER JOIN Status s ON ps.statusID = s.statusID 
LEFT JOIN Disease d ON s.diseaseID = d.diseaseID 
WHERE ps.personID = ?;

SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps 
INNER JOIN People p ON ps.personID = p.personID 
INNER JOIN Status s ON ps.statusID = s.statusID 
LEFT JOIN Disease d ON s.diseaseID = d.diseaseID 
WHERE ps.statusID = ?;

SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps 
INNER JOIN People p ON ps.personID = p.personID 
INNER JOIN Status s ON ps.statusID = s.statusID 
LEFT JOIN Disease d ON s.diseaseID = d.diseaseID 
ORDER BY ps.dateAdded DESC;

SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps 
INNER JOIN People p ON ps.personID = p.personID 
INNER JOIN Status s ON ps.statusID = s.statusID 
LEFT JOIN Disease d ON s.diseaseID = d.diseaseID 
ORDER BY ps.dateAdded ASC;

--Delete and Add--
INSERT INTO People_status (personID, statusID, dateAdded) VALUES (?,?,?);
DELETE FROM People_status WHERE psID = ?;

--Update--
SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps 
INNER JOIN People p ON ps.personID = p.personID 
INNER JOIN Status s ON ps.statusID = s.statusID 
LEFT JOIN Disease d ON s.diseaseID = d.diseaseID 
WHERE ps.psID = ?;

UPDATE People_status SET personID=?, statusID=?, dateAdded=? WHERE psID=?
