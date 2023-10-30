const mongoose = require('mongoose');

const addSchema = new mongoose.Schema({

    customername: {
        type: String,
        require: true,
        trim: false,
        min: 3,
        max: 20
    },
    phonenumber: {
        type: String,
        require: true,
        trim: true,
        min: 3,
        max: 20
    },
    weight: {
        type: String,
        require: true,
        trim: true,
    },
    soap: {
        type: String,
        require: true,
        trim: false,
    },
    machine: {
        type: String,
        require: true,
        trim: false,
    },
    discount: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: false,
        trim: true,
        unique: false,
        lowercase: true
    },
},{timestamps: true});


module.exports = mongoose.model('Add', addSchema);