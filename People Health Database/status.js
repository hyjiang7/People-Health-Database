module.exports = function(){
  
    var express = require('express');
    var router = express.Router();
    
     /*Select query to display all status info on */
    function getStatus(res, req, mysql, context, complete){
        var mysql = req.app.get('mysql');
        mysql.pool.query("SELECT s.statusID, s.name, s.explanation, d.diseaseID, d.name AS diseaseName FROM Status s LEFT JOIN Disease d ON d.diseaseID = s.diseaseID ORDER BY s.name;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.status  = results;
            complete();
        });
    }


    /*Gets all of the dieases's dieaseID to populate the dropdown menu for displaying status menu*/
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


    /*original request to pay to render Disease entity*/
    router.get('/', function(req, res){
       
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletestatus.js"];
        var mysql = req.app.get('mysql');

        getStatus(res, req, mysql, context, complete);
        getDiseases(res, req, mysql, context, complete);

        function complete(){
            callbackCount++;
            if (callbackCount >= 2) {
               
                res.render('status', context);
            }

        }
    
    });

    /* Adds a status, redirects to the status page after adding */
    router.post('/', function(req, res){

        if(req.body.diseaseID==='null'){
            console.log("inside NULL");
            req.body.diseaseID = null;
        }

        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `Status` (`name`, `explanation`, `diseaseID`) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.explanation, req.body.diseaseID];
        
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/status');
            }
        });
    });


    /*Deletes a status based on statusID */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Status WHERE statusID = ?";
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


    /* Function to select the ONE status to be edited */
    function getUpdateStatus(res, mysql, context, id, complete) {
        var sql = "SELECT s.statusID, s.name, s.explanation, d.diseaseID, d.name AS diseaseName FROM Status s LEFT JOIN Disease d ON d.diseaseID = s.diseaseID WHERE s.statusID=?;";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.status = results[0];
           
            complete();
        });

    }

    /* Displays ONE status for updating that one status GET request*/
    router.get('/:id', function(req, res){
        
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatestatus.js"];
        var mysql = req.app.get('mysql');
        getUpdateStatus(res, mysql, context, req.params.id, complete);
        getDiseases(res, req, mysql, context, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('updatestatus', context);
            }

        }
    });

    /* The URI that update data is sent to in order to update a status PUT request*/
    router.put('/:id', function(req, res){

        if(req.body.diseaseID==='null'){
            console.log("inside NULL");
            req.body.diseaseID = null;
        }
        var mysql = req.app.get('mysql');

        var sql = "UPDATE Status SET name=?, explanation=?, diseaseID=? WHERE statusID=?";

        var inserts = [req.body.name, req.body.explanation, req.body.diseaseID,req.params.id];

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