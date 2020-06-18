const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const Transaction = new Schema({
    transaction_date: {
        type: Date,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('Transaction', Transaction);
