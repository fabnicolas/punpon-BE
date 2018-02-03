var mongoconnection = require('../mongoconnection');
var Promise = require('promise');

function UserModel(){
    this.create = function(nickname, password, email, telegram_id){
        return new Promise((resolve, reject) => {
            mongoconnection.acquire((mongoose, mongomodels) => {
                var new_user = mongomodels.User({
                    nickname: nickname,
                    password: password,
                    email: email,
                    telegram_id: telegram_id
                });
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

    this.findUser = function(nickname){
        return new Promise((resolve, reject) => {
            mongoconnection.acquire(function (mongoose, mongomodels) {
                mongomodels.User.find({nickname: nickname}, function(err, users) {
                    if(err){
                        res.send({status: 1, message: err});
                    }else{
                        res.send({status: 0, message: users});
                    }
                });
            });
        });
    }
}

module.exports = new UserModel();