let skip_if_empty = function(value){
	if(value === null || (typeof value === 'string' && value.length === 0)) return undefined;
	else                                                                   return value;
};

module.exports = function(mongoose){
    var Schema = mongoose.Schema;

    // Puns are embedded inside User.
    var Pun = new Schema({
        category: String,
        text: String,
        is_approved: Boolean
    });

    var User = new Schema({
        nickname: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        email: {type: String, trim: true, index: {
                unique: true, partialFilterExpression: {email: {$type: 'string'}}
            }, set: skip_if_empty},
        telegram_id: {type: String, trim: true, index: {
                unique: true, partialFilterExpression: {telegram_id: {$type: 'string'}}
            }, set: skip_if_empty},
        puns: [{type: Schema.Types.ObjectId, ref: 'Pun'}]
    });

    // Models
    var PunModel = mongoose.model('Pun', Pun);
    var UserModel = mongoose.model('User', User);

    return{
        Pun: PunModel,
        User: UserModel
    };
};