var mongoconnection = require('./mongoconnection');
// Eventually SQL connection

function Connection(){
    // Assuming we have only nosql for the moment
    this.con_type = "nosql";

    this.initConnection = function(){
        if(this.con_type==="nosql") mongoconnection.init();
        // Else SQL
    }

    this.acquire = function(callback) {
        if(this.con_type==="nosql") mongoconnection.acquire(callback);
        // Else SQL
    };

    this.testConnection = function(res){
        if(this.con_type==="nosql")
            this.acquire(function (mongoose, mongomodels) {
                mongomodels.User.find({email: "finalgalaxy@gmail.com"}, function(err, users) {
                    if(err){
                        res.send({status: 1, message: err});
                    }else{
                        console.log("Test OK!");
                        res.send({status: 0, message: users});
                    }
                });
            });
        // Else SQL
    }
}

module.exports = new Connection();