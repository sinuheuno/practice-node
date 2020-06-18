const express = require('express'),
    router = express.Router(),
    userController = require('../controller/user');
    simController = require('../controller/sim');

router.get('/', userController.verifyToken, simController.index)
router.get('/report', userController.verifyToken, simController.getSims)
router.get('/report/:id', userController.verifyToken, simController.getSims);
router.get('/distributor/:id', userController.verifyToken, simController.getSimsByDistributorId);
router.put('/:id', userController.verifyToken, simController.update);
router.put('/phone/:phone', userController.verifyToken, simController.updatePhone);
router.post('/push/:id', userController.verifyToken, simController.pushSims);
router.delete('/clear/:id', userController.verifyToken, simController.clearSims);

module.exports = router;
