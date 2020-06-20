const express = require('express'),
    router = express.Router(),
    balanceController = require('../controller/balance');

router.post('/', balanceController.addBalance);

module.exports = router;
