var mongoconnection = require('./mongoconnection');

function Connection(){
    this.initConnection = function(){
        mongoconnection.init();        
    }

    this.testConnection = function(res){
        mongoconnection.acquire(function (mongoose, mongomodels) {
            mongomodels.User.find({email: "finalgalaxy@gmail.com"}, function(err, users) {
                if(err){
                    res.send({status: 1, message: err});
                }else{
                    res.send({status: 0, message: users});
                }
            });
        });
    }
}

module.exports = new Connection();