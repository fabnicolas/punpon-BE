var bCrypt = require("bcrypt");
var bCrypt_salt=10;

function Auth(){
    this.encryptPassword = function(password){
        return bCrypt.hashSync(password, 10);
    }
}

module.exports = new Auth();