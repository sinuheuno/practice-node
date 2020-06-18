const express = require('express'),
    router = express.Router(),
    balanceController = require('../controller/balance');

router.get('/', balanceController.addBalance);

module.exports = router;
