const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Distributor = new Schema({
    active: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    register_date: {
        type: Number,
        required: true
    },
    registered_by: {
        type: Object,
        required: true
    },
    city: {
        type: String,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('Distributor', Distributor);
