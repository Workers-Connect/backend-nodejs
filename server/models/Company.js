const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let companySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    img: {
        type: String,
        required: false
    },
    cif: {
        type: String,
        required: [true, 'El nif es requerido']
    },
    status: {
        type: Boolean,
        default: true
    }
});

companySchema.methods.toJSON = function(){
    let company = this;
    let companyObject = company.toObject();
    return companyObject;
}

companySchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Company', companySchema);
