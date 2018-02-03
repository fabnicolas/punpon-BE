let skip_if_empty = function(value){
	if(value == null || (typeof value === 'string' && value.length === 0)) return undefined;
	else                                                                   return value;
};

module.exports = function(mongoose){
    var Schema = mongoose.Schema;

    // Puns are embedded inside User.
    var Puns = new Schema({
        category: String,
        text: String
    });

    var User = new Schema({
        nickname: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        email: {type: String, unique: true, set: skip_if_empty},
        telegram_id: {type: String, set: skip_if_empty},
        puns: [Puns]
    });

    // Model just the user.
    var UserModel = mongoose.model('User', User);

    return{
        User: UserModel
    };
};