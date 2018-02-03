
var connection = require('./db/connection.js');
var config = require('./config');
var user = require('./db/'+connection.con_type+'_models/user');

 
module.exports = {
    configure: function(app) {
        // Index of web server (for testing).
        app.get('/', function(req, res) {
		    res.end('No index provided.');
        });

        app.get('/test_connection/', function(req, res){
            connection.testConnection(res);
        });

        app.get('/create/', function(req, res){
            user.create("Finalgalaxy","testpsw","finalgalaxy@gmail.com",null).then(()=>{
                res.send("OK");
            }).catch(err=>{
                res.send("Error on create endpoint: "+err);
            });
        });

        app.get("/delete_all/", function(req, res){
            connection.acquire(function (mongoose, mongomodels) {
                mongomodels.User.remove({}, function(err,removed) {
                    if(err) res.send("Error on delete: "+err);
                    else    res.send("Deleted");
                });
            });
        });
    }
};