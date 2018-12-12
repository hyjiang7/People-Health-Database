module.exports = function(){
   
    var express = require('express');
    var router = express.Router();
    
    /*Select query to display all ps info on */
    function getPs(res, req, mysql, context, complete){
        var mysql = req.app.get('mysql');
        var query = "SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps INNER JOIN People p ON ps.personID = p.personID INNER JOIN Status s ON ps.statusID = s.statusID LEFT JOIN Disease d ON s.diseaseID = d.diseaseID Order BY p.lname";
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.end();
            }
           
            context.ps = results;
            complete();

        });
        
    }


    /*Gets all of the people's peopleIDs to populate the dropdown menu for displaying pds menu form*/
    function getPeopleName(res, req, mysql, context, complete){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT personID, fname, lname FROM People ORDER BY lname", function(error, results, fields){
            if(error){
                res.end();
            }
            context.people  = results;
            complete();
        });
    }


    /*Gets all of the status's statusIDs to populate the dropdown menu for displaying pds menu form*/
    function getStatusName(res, req, mysql, context, complete){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT s.statusID, s.name, s.explanation, s.diseaseID, d.name AS diseaseName FROM Status s LEFT JOIN Disease d ON d.diseaseID = s.diseaseID ORDER BY s.name", function(error, results, fields){
            if(error){
                res.end();
            }
            context.status  = results;
            complete();
        });
    }


    /*Query to filter people from ps based on person's id*/
    function filterPeople(res, req, mysql, context, complete){
        var query = "SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps INNER JOIN People p ON ps.personID = p.personID INNER JOIN Status s ON ps.statusID = s.statusID LEFT JOIN Disease d ON s.diseaseID = d.diseaseID WHERE ps.personID = ?";
        
        var inserts = [req.params.id];
        mysql.pool.query(query, inserts, function(error, results, fields){
                if(error){
                    res.end();
                }
                context.ps = results;
                complete();
            });
    }


    /*Query to filter people from ps based on person's id*/
    function filterStatus(res, req, mysql, context, complete){
        var query = "SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps INNER JOIN People p ON ps.personID = p.personID INNER JOIN Status s ON ps.statusID = s.statusID LEFT JOIN Disease d ON s.diseaseID = d.diseaseID WHERE ps.statusID = ?";
        
        var inserts = [req.params.id];
        mysql.pool.query(query, inserts, function(error, results, fields){
                if(error){
                    res.end();
                }
                context.ps = results;
                complete();
            });
    }


    /*Query to filter people from ps based on person's id*/
    function filterDate(res, req, mysql, context, complete){
     
        if(req.params.id == 1){
            var query = "SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps INNER JOIN People p ON ps.personID = p.personID INNER JOIN Status s ON ps.statusID = s.statusID LEFT JOIN Disease d ON s.diseaseID = d.diseaseID ORDER BY ps.dateAdded DESC";
        }
        else {
            var query = "SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps INNER JOIN People p ON ps.personID = p.personID INNER JOIN Status s ON ps.statusID = s.statusID LEFT JOIN Disease d ON s.diseaseID = d.diseaseID ORDER BY ps.dateAdded ASC";
        }
        
    
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.end();
            }
           
            context.ps = results;
            complete();

        });
    }


    /*original request to render People_status entity*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterPs.js","deleteps.js"];             
        var mysql = req.app.get('mysql');

        getPs(res, req, mysql, context, complete);
        getPeopleName(res, req, mysql, context, complete);
        getStatusName(res, req, mysql, context, complete);

        function complete(){
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('people_status', context);
            }

        }
    });


    /* Adds a People_status, redirects to the original page after adding */
    router.post('/', function(req, res){
        
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `People_status` (`personID`, `statusID`, `dateAdded`) VALUES (?,?,?)";
        var inserts = [req.body.personID, req.body.statusID, req.body.dateAdded];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
              
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/people_status');
            }
        });
    });

    /*Display all ps relationship given a person's id*/
    router.get('/filter/people/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterPs.js","deleteps.js"];
        var mysql = req.app.get('mysql');
    
        filterPeople(res, req, mysql, context, complete);
        getPeopleName(res, req, mysql, context, complete);
        getStatusName(res, req, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('people_status', context);
            }

        }
    });


    /*Display all ps relationship given a status' id*/
    router.get('/filter/status/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterPs.js","deleteps.js"];
        var mysql = req.app.get('mysql');
    
        filterStatus(res, req, mysql, context, complete);
        getPeopleName(res, req, mysql, context, complete);
        getStatusName(res, req, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('people_status', context);
            }

        }
    });


    /*Display all ps relationship by most recent or oldest*/
    router.get('/filter/date/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterPs.js","deleteps.js"];
        var mysql = req.app.get('mysql');
    
        filterDate(res, req, mysql, context, complete);
        getPeopleName(res, req, mysql, context, complete);
        getStatusName(res, req, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('people_status', context);
            }

        }
    });

    /*Deletes a people based on personID */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM People_status WHERE psID = ?";
        var inserts = [req.params.id];
      
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        });
    });


    /* Function to select the ONE Ps to be edited */
    function getUpdatePs(res, mysql, context, id, complete) {
        var sql = "SELECT ps.psID, ps.personID, ps.statusID, p.fname, p.lname, s.name, s.explanation, s.diseaseID, d.name AS diseaseName, ps.dateAdded FROM People_status ps INNER JOIN People p ON ps.personID = p.personID INNER JOIN Status s ON ps.statusID = s.statusID LEFT JOIN Disease d ON s.diseaseID = d.diseaseID WHERE ps.psID = ?;";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ps = results[0];
        
            complete();
        });

    }


    /* Displays ONE ps for updating that ONE ps ---- GET request*/
    router.get('/:id', function(req, res){
       
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateps.js"];
        var mysql = req.app.get('mysql');
        getUpdatePs(res, mysql, context, req.params.id, complete);
        getPeopleName(res, req, mysql, context, complete);
        getStatusName(res, req, mysql, context, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('updatepeople_status', context);
            }

        }
    });

    /* The URI that update data is sent to in order to update a pds PUT request*/

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');

        var sql = "UPDATE People_status SET personID=?, statusID=?, dateAdded=? WHERE psID=?";

        var inserts = [req.body.personID, req.body.statusID, req.body.dateAdded, req.params.id];


        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    return router;

}();

