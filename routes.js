
var connection = require('./db/connection.js');
var config = require('./config');
var user = require('./db/'+connection.con_type+'_models/user');
var auth = require('./models/auth');

function validateNickname(nickname){
    return (nickname!=null && nickname!='' && nickname!=undefined);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    return re.test(password);
}
 
module.exports = {
    configure: function(app) {
        // Index of web server (for testing).
        app.get('/', function(req, res) {
		    res.end('No index provided.');
        });

        app.get('/test_connection/', function(req, res){
            connection.testConnection(res);
        });

        app.post("/register/telegram/", function(req, res){
            let nickname = req.body.nickname;
            let password = req.body.password;
            let telegram_id = req.body.telegram_id;

            if(validateNickname(nickname) && validatePassword(password) && !isNaN(telegram_id)){
                auth.encryptPassword(password, (err, encrypted_password)=>{
                    user.create(nickname, encrypted_password, null, telegram_id).then(()=>{
                        res.send({status: 0, message: "User created!"});
                    }).catch(err=>{
                        res.send({status: 1, message: "User NOT created! Error: "+err});
                    });
                });
            }else{
                res.send({status: 1, message: "Error: invalid data."});
            }
        });

        app.post("/login/telegram/", function(req, res){
            if(req.session.nickname==undefined){
                let telegram_id = req.body.telegram_id;
                let password = req.body.password;
                if(validatePassword(password) && !isNaN(telegram_id)){
                    user.get({telegram_id: telegram_id}).then(user_data => {
                        auth.checkPassword(password, user_data.password, (err, result)=>{
                            if(err) res.send("Error: invalid data.");
                            else{
                                req.session.nickname = user_data.nickname;
                                res.send({status: 0, message: "Access OK!"});
                            }
                        });
                    }).catch(err => res.send({status: 1, message: "Error while logging: "+err}));
                }else{
                    res.send({status: 1, message: "Error: invalid data."});
                }
            }else{
                res.send({status: 1, message: "Error: you are already logged."});
            }
        });

        app.get("/logout/", function(req, res){
            if(req.session.nickname!=undefined){
                req.session.nickname=undefined;
                res.send({status: 0, message: "You are disconnected now."});
            }else{
                res.send({status: 1, message: "Error: you were not logged before!"});
            }
        });

        app.get("/user/:nickname", function(req, res){
            let nickname = req.params.nickname;
            if(validateNickname(nickname)){
                user.get({nickname: nickname}).then(user_data => {
                    res.send({
                        status: 0,
                        message: "Profile loaded.",
                        nickname: user_data.nickname,
                        puns: user_data.puns
                    });
                }).catch(err => res.send({status: 1, message: "Error: "+err}));
            }else{
                res.send({status: 1, message: "Error: invalid nickname."});
            }
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