const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Sim = new Schema({
    active: {
        type: Boolean,
        required: false,
        default: false
    },
    serial_number: {
        type: String,
        required: true
    },
    activation_date: {
        type: Date,
        required: false
    },
    phone_number: {
        type: String,
        required: true
    },
    register_date: {
        type: Date,
        required: true
    },
    registered_by: {
        type: Object,
        required: true
    },
    distributor_id: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('Sim', Sim);
