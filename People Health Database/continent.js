module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*Select query to display all continent info on */
    function getContinent(res, req, mysql, context, complete){
        var mysql = req.app.get('mysql');
        var query = "SELECT c.continentID, c.name, c.climate, c.publicHealth, c.population, d.name AS diseaseName FROM Continent c LEFT JOIN Disease d ON c.diseaseID = d.diseaseID ORDER BY c.name;";
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                //res.write(JSON,stringify(error));
                res.end();
            }
            //console.log(results);
            context.continent = results;
            complete();

        });
        
    }

    /*Gets all of the dieases's dieaseID to populate the dropdown menu for displaying continent menu*/
    function getDiseases(res, req, mysql, context, complete){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT diseaseID, name FROM Disease ORDER BY name", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.diseases  = results;
            complete();
        });
    }

   

    /*original request to pay to render Continent entity*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecontinent.js"];
        var mysql = req.app.get('mysql');

        getContinent(res, req, mysql, context, complete);
        getDiseases(res, req, mysql, context, complete);

        function complete(){
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('continent', context);
            }

        }
    });

   




    /* Adds a continent, redirects to the continent page after adding */

    router.post('/', function(req, res){
        
        if(req.body.diseaseID==='null'){
            console.log("inside NULL");
            req.body.diseaseID = null;
        }

        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Continent (name, climate, publicHealth, population, diseaseID) VALUES (?,?,?,?, ?)";
        var inserts = [req.body.name, req.body.climate, req.body.publicHealth, req.body.population, req.body.diseaseID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/continent');
            }
        });
    });

  


    /*Deletes a continent based on continentID */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Continent WHERE continentID = ?";
        var inserts = [req.params.id];
        console.log(req.params.id);
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    });


    /* Function to select the one continent to be edited */
    function getUpdateContinent(res, mysql, context, id, complete) {
        var sql = "SELECT c.continentID AS id, c.name, c.climate, c.publicHealth, c.population, d.name AS diseaseName, d.diseaseID FROM Continent c LEFT JOIN Disease d ON c.diseaseID = d.diseaseID WHERE c.continentID =?;";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.continent = results[0];
            console.log(context.continent);
            complete();
        });

    }

    /* Displays one continent for updating that one continent GET request*/
    router.get('/:id', function(req, res){
       
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecontinent.js"];
        var mysql = req.app.get('mysql');
        getUpdateContinent(res, mysql, context, req.params.id, complete);
        getDiseases(res, req, mysql, context, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('updatecontinent', context);
            }

        }
    });


     /* The URI that update data is sent to in order to update a continent PUT request*/
     router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
   
        var sql = "UPDATE Continent SET name=?, climate=?, publicHealth=?, population=?, diseaseID=? WHERE continentID=?";

        if(req.body.diseaseID==='NULL'){
            console.log("inside NULL");
            req.body.diseaseID = null;
        }

        var inserts = [req.body.name, req.body.climate, req.body.publicHealth, req.body.population, req.body.diseaseID, req.params.id];

        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error);
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });



    return router;

}();