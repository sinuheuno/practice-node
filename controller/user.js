// Import Models
const User = require('../model/user');
const userTypes = require('../utils/validations/user-type');
const userValidator = require('../utils/validations/user-validator');
const jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let models = require('../utils/model-list');
let controller = require('./base');

// Handle index actions
exports.index =  (req, res) => {
    userValidator.validateUser(req.token, res, userTypes.admin)
        .then(response => {
            if (response) {
                controller.index(res, models.list.user);
            }
        })
};
// Handle create user actions
exports.new = (req, res) => {
    userValidator.validateUser(req.token, res, userTypes.user)
        .then(response => {
            if (response) {
                bcrypt.hash(req.body.password, process.env.SALT_ROUNDS, (err, hash) => {
                    if (err) {
                        res.json(models.list.user.messages.error.creatingUserError);
                    } else {
                        var user = new User();
                        user.active = true
                        user.name = req.body.name;
                        user.type = req.body.type;
                        user.email = req.body.email;
                        user.password = hash;

                        // save the user and check for errors
                        user.save((err) => {
                            if (err) {
                                res.json(err);
                            } else {
                                res.json({
                                    message: models.list.user.messages.success.userCreated,
                                    data: user
                                });
                            }
                        });
                    }
                });
            }
        })
};

exports.newUserWithoutAuthentication = (req, res) => {
    bcrypt.hash(req.body.password, process.env.SALT_ROUNDS, (err, hash) => {
        if (err) {
            res.json(err);
        } else {
            var user = new User();
            user.active = true
            user.name = req.body.name;
            user.type = req.body.type;
            user.email = req.body.email;
            user.password = hash;

            // save the user and check for errors
            user.save((err) => {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        message: models.list.user.messages.success.userCreated,
                        data: user
                    });
                }
            });
        }
    });
};

// Handle view user info
exports.view = (req, res) => {
    userValidator.validateUser(req.token, res, userTypes.admin)
        .then(response => {
            if (response) {
                controller.index(req, res, models.list.user);
            }
        })
};

// Handle update user info
exports.update = (req, res) => {
    userValidator.validateUser(req.token, res, userTypes.admin)
        .then(response => {
            if (response) {
                controller.update(req, res, models.list.user);
            }
        })
};

// Handle delete user
exports.delete = (req, res) => {
    userValidator.validateUser(req.token, res, userTypes.admin)
        .then(response => {
            if (response) {
                controller.delete(req, res, models.list.user);
            }
        })
};

exports.login = (req, res) => {
    User.find({ email: req.body.email }, (err, user) => {
        if (err) {
            res.send(err);
        } else if (user.length === 1) {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (result) {
                    jwt.sign({ user: user[0].email, password: user[0].password, type: user[0].type, _id: user[0]._id }, process.env.SECRET_KEY, { expiresIn: '30d' }, (err, token) => {
                        if (err) {
                            res.json(err)
                        } else {
                            res.json({
                                message: models.list.user.messages.success.login,
                                token
                            });
                        }
                    });
                } else {
                    res.json(models.list.user.messages.error.loginError)
                }
            });
        } else {
            res.json(models.list.user.messages.error.loginError)
        }
    });
};

exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        req.token = bearerToken;

        next();
    } else {
        res.sendStatus(403);
    }
};