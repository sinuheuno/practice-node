const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const User = new Schema({
    active: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('User', User);
