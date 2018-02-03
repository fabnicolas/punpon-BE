// Require mongoose ORM driver for connecting with database
var config = require('../config');

// Connection function for DB interaction
function Mongoconnection() {
    var mongoose=null;
    var mongomodels=null;

    // Initialize connection.
    this.init = function() {
        this.mongoose = require('mongoose');
        this.mongomodels = require('./mongomodels')(this.mongoose);
        let db = this.mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB: NOT connected!'));
        db.once('open', function(){console.log("MongoDB: connected!")});
        this.mongoose.connect('mongodb://'+config.db_user+":"+config.db_password+config.db_at+config.db_port+"/"+config.db_name);
    };
    
    this.switch_db = function(new_db) {
        if(this.mongoose!=null){
            this.mongoose.disconnect();
            this.mongoose.connect('mongodb://'+config.db_user+":"+config.db_password+config.db_at+config.db_port+"/"+new_db);
        }
    };
    
    this.acquire = function(callback) {
        callback(this.mongoose, this.mongomodels);
    };
}

// Export this function to other node scripts
module.exports = new Mongoconnection();