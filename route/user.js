const express = require('express'),
    router = express.Router(),
    userController = require('../controller/user');

router.post('/login', userController.login);

module.exports = router;
