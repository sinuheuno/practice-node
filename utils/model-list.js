const Distributor = require('../model/distributor'),
    User = require('../model/user'),
    Sim = require('../model/sim'),
    Transaction = require('../model/transaction'),
    _messages = require('./messages');

exports.list = {
    distributor: {
        model: Distributor,
        properties: [
            'active',
            'name',
            'email',
            'phone_number',
            'register_date',
            'registered_by',
            'city'
        ],
        messages: _messages.messages.distributor
    },
    user: {
        model: User,
        properties: [
            'active',
            'name',
            'password',
            'email',
            'type'
        ],
        messages: _messages.messages.user
    },
    sim: {
        model: Sim,
        properties: [
            'active',
            'serial_number',
            'activation_date',
            'phone_number',
            'register_date',
            'registered_by',
            'distributor_id'
        ],
        messages: _messages.messages.sim
    },
    transaction: {
        model: Transaction,
        properties: [
            'date',
            'phone_number',
            'distributor_id',
            'transaction_number',
            'transaction_id',
            'amount',
            'return_code',
            'success'
        ],
        messages: _messages.messages.transaction
    }
};