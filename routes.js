
var connection = require('./db/connection.js');
var config = require('./config');
 
module.exports = {
    configure: function(app) {
        // Index of web server (for testing).
        app.get('/', function(req, res) {
		    res.end('No index provided.');
        });

        app.get('/users/', function(req, res){
            connection.testConnection(res);
        });
    }
};