const express = require('express'),
    router = express.Router(),
    userController = require('../controller/user');
    distributorController = require('../controller/distributor');

router.get('/', userController.verifyToken, distributorController.index);
router.post('/', userController.verifyToken, distributorController.new);
router.get('/:id', userController.verifyToken, distributorController.view);
router.patch('/:id', userController.verifyToken, distributorController.update);
router.put('/:id', userController.verifyToken, distributorController.update);
router.delete('/:id', userController.verifyToken, distributorController.delete);

module.exports = router;
