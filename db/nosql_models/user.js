var mongoconnection = require('../mongoconnection');
var Promise = require('promise');

function is_empty(variable){
    return variable==undefined || variable==null || variable=='' || variable==0;
}

function UserModel(){
    this.create = function(nickname, password, email, telegram_id){
        return new Promise((resolve, reject) => {
            mongoconnection.acquire((mongoose, mongomodels) => {
                let user_parameters = {};
                user_parameters.nickname=nickname;
                user_parameters.password=password;
                if(!is_empty(email)) user_parameters.email=email;
                if(!is_empty(telegram_id)) user_parameters.telegram_id=telegram_id;

                let new_user = mongomodels.User(user_parameters);
                console.log(new_user);
                new_user.save((err) => {
                    if(err) reject("Error while creating user: "+err);
                    else    resolve("OK");
                });
            });
        });
    }

    this.createUsingTelegramID = function(nickname, password, telegram_id){
        this.create(nickname, password, null, telegram_id);
    }

    this.createUsingEmail = function(nickname, password, email){
        this.create(nickname, password, email, null);
    }

    this.get = function(parameters){
        return new Promise((resolve, reject) => {
            mongoconnection.acquire(function (mongoose, mongomodels) {
                mongomodels.User.findOne(parameters, function(err, user) {
                    if(err){
                        reject(err);
                    }else{
                        if(user==null) reject("User not found.");
                        else           resolve(user);
                    }
                });
            });
        });
    }
}

module.exports = new UserModel();