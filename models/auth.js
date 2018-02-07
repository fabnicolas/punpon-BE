var bCrypt = require("bcrypt");
var bCrypt_salt=10;

function Auth(){
    this.encryptPassword = function(password, callback){
        bCrypt.hash(password, 10, callback);
    }

    this.checkPassword = function(password, saved_password, callback){
        bCrypt.compare(password, saved_password, callback);
    }
}

module.exports = new Auth();