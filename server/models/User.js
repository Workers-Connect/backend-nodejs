const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValid = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'El correo electrónico es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerido']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValid
    },
    status: {
        type: Boolean,
        default: true
    },
    company: { 
        type: Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true 
    }
});

userSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('User', userSchema);
