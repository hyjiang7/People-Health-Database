module.exports = function(){
    var express = require('express');
    var router = express.Router();

   /*Gets all of the continent's continentID to populate the dropdown menu for displaying continent menu*/
    function getContinents(res, req, mysql, context, complete){
        var mysql = req.app.get('mysql');
        var query = "SELECT continentID, name FROM Continent ORDER BY name; ";
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.end();
            }
            context.continents = results;
            complete();

        });
        
    }
    

     /*Select query to display all people info on */
    function getPeople(res, req, mysql, context, complete){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT p.personID, p.fname, p.lname, p.birthdate, c.name AS currentContinent FROM People p LEFT JOIN Continent c ON p.currentContinent= c.continentID ORDER BY p.lname;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people  = results;
    
            complete();
        });
    }

    /*original request to pay to render people entity*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepeople.js"];
        var mysql = req.app.get('mysql');

        getPeople(res, req, mysql, context, complete);
        getContinents(res, req, mysql, context, complete);

        function complete(){
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('people', context);
            }
        }
        
    });


    /* Adds a people, redirects to the people page after adding */
    router.post('/', function(req, res){
        
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `People` (`fname`, `lname`, `birthdate`, `currentContinent`) VALUES (?,?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.birthdate, req.body.currentContinent];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error);
                res.end();
            }else{
                res.redirect('/people');
            }
        });
    });


    /*Deletes a people based on personID */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM People WHERE personID = ?";
        var inserts = [req.params.id];
  
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error);
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        });
    });

    /* Function to select the ONE Person to be edited */
    function getUpdatePerson(res, mysql, context, id, complete) {
        var sql = "SELECT p.personID, p.fname, p.lname, p.birthdate, c.name AS currentContinent, c.continentID FROM People p LEFT JOIN Continent c ON p.currentContinent= c.continentID WHERE p.personID =?;";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results[0];
        
            complete();
        });

    }
    /* Displays ONE person for updating that ONE person GET request*/
    router.get('/:id', function(req, res){
       
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatepeople.js"];
        var mysql = req.app.get('mysql');
        getUpdatePerson(res, mysql, context, req.params.id, complete);
        getContinents(res, req, mysql, context, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('updatepeople', context);
            }

        }
    });


    /* The URI that update data is sent to in order to update a people PUT request*/
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');

        var sql = "UPDATE People SET fname=?, lname=?, birthdate=?, currentContinent=? WHERE personID=?";

        var inserts = [req.body.fname, req.body.lname, req.body.birthdate, req.body.currentContinent, req.params.id];

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