const userTypes = require('../utils/validations/user-type'),
    models = require('../utils/model-list'),
    baseController = require('./base'),
    userValidator = require('../utils/validations/user-validator'),
    jwt = require('jsonwebtoken');

// Handle index actions
exports.index = (req, res) => {
    userValidator.validateUser(req.token, res, userTypes.user)
        .then(response => {
            if (response) {
                baseController.index(res, models.list.distributor);
            }
        })
};

// Handle create distributor actions
exports.new = (req, res) => {
    userValidator.validateUser(req.token, res, userTypes.user)
        .then(response => {
            if (response) {
                let newEntity = new models.list.distributor.model();

                models.list.distributor.properties.forEach(prop => {
                    newEntity[prop] = req.body[prop]
                });

                newEntity['active'] = true;

                const decoded = jwt.decode(req.token, {complete: true});

                models.list.user.model.findById(decoded.payload._id, (error, user) => {
                    if (error) {
                        res.json(models.list.distributor.messages.error.couldNotSaveDistributor)
                    } else {
                        if (user !== null) {
                            newEntity['registered_by'] = {
                                _id: user._id,
                                name: user.name,
                                email: user.email,
                            };
                            newEntity.save((err) => {
                                if (err) {
                                    res.json(err);
                                } else {
                                    res.json({
                                        message: models.list.distributor.messages.success.created,
                                        data: newEntity
                                    });
                                }
                            });
                        } else {
                            res.json(models.list.user.messages.error.userNotFound)
                        }
                    }
                });
            }
        })
};

// Handle view distributor info
exports.view = (req, res) => {
    userValidator.validateUser(req.token, res, userTypes.user)
        .then(response => {
            if (response) {
                baseController.view(req, res, models.list.distributor);
            }
        })
};

// Handle update distributor info
exports.update = (req, res) => {
    userValidator.validateUser(req.token, res, userTypes.admin)
        .then(response => {
            if (response) {
                baseController.update(req, res, models.list.distributor);
            }
        })
};

// Handle delete distributor
exports.delete = (req, res) => {
    userValidator.validateUser(req.token, res, userTypes.admin)
        .then(response => {
            if (response) {
                baseController.delete(req, res, models.list.distributor);
            }
        })
};
