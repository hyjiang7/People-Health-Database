module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* Function selects all of the diseases so it can be rendered on /disease page */
    function getDiseases(res, req, mysql, context, complete){
        var mysql = req.app.get('mysql');
        var query = "SELECT diseaseID, name, lifestyleInfluence, hereditary, medicine FROM Disease";
        mysql.pool.query(query, function(error, results, fields){
            if(error){

                res.end();
            }
            context.disease = results;
            complete();

        });
        
    }
   

    /*original request to pay to render Disease entity*/
    router.get('/', function(req, res){
        
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletedisease.js"];
        var mysql = req.app.get('mysql');

        getDiseases(res, req, mysql, context, complete);

        function complete(){
            callbackCount++;
            if (callbackCount >= 1) {
              
                res.render('disease', context);
            }

        }
    });


    /* Adds a Disease through post request*/
    router.post('/', function(req, res){
       
 
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `Disease` (`name`, `hereditary`, `lifestyleInfluence`, `medicine`) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.name, req.body.lifestyleInfluence, req.body.hereditary, req.body.medicine];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
    
                res.write(JSON.stringify(error));
                res.end();
            }else{
              
                res.redirect('/disease');
            }
        });
    });

    
    /*Deletes a person based on the id passed in  */
      router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Disease WHERE diseaseID = ?";
        var inserts = [req.params.id];
    
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


     /* Function to select the ONE disease to be edited */
     function getDisease(res, mysql, context, id, complete) {
        var sql = "SELECT diseaseID AS id, name, lifestyleInfluence, hereditary, medicine FROM Disease WHERE diseaseID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.disease = results[0];
            complete();
        });

    }


    /* Displays one disease for updating that one disease GET request*/
    router.get('/:id', function(req, res){
       
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatedisease.js"];
        var mysql = req.app.get('mysql');
        getDisease(res, mysql, context, req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('updatedisease', context);
            }

        }
    });
    

    /* The URI that update data is sent to in order to update a disease PUT request*/
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');   
        var sql = "UPDATE Disease SET name=?,  lifestyleInfluence=?, hereditary=?, medicine=? WHERE diseaseID=?";

        var inserts = [req.body.name, req.body.lifestyleInfluence, req.body.hereditary, req.body.medicine, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error);
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


