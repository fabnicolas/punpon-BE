module.exports = function(mongoose){
    var Schema = mongoose.Schema;

    // Puns are embedded inside User.
    var Puns = new Schema({
        category: String,
        text: String
    });

    var User = new Schema({
        nickname: String,
        email: String,
        password: String,
        telegram_id: String,
        puns: [Puns]
    });

    // Model just the user.
    mongoose.model('User', User);

    return{
        User: User,
        Puns: Puns
    };
};