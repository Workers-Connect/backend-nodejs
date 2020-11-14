const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let recoveryPasswordSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    code: {
        type: String
    },
    company: { 
        type: Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true 
    }
});

recoveryPasswordSchema.methods.toJSON = function(){
    let recoveryPassword = this;
    let recoveryPasswordObject = recoveryPassword.toObject();
    return recoveryPasswordObject;
}

recoveryPasswordSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('RecoveryPassword', recoveryPasswordSchema);
