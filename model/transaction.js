const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Transaction = new Schema({
    date: {
        type: Date,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    distributor_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    transaction_number: {
        type: String,
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    return_code: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('Transaction', Transaction);
