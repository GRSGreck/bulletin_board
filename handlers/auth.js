'use strict';

const UserModel = require('../models/user');
const IdCountersModel = require('../models/idCounters');
const jwt = require('jsonwebtoken');
const logger = require('../libs/logger')(module);

module.exports = function Auth() {
    this.home = function(req, res, next) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    };

    this.login = function(req, res, next) {
        UserModel.findOne({ email: req.body.email }, function(err, user) {
            if (err) {
                logger.error(err);
                err.status = 422;

                return next(err);
            }

            if (!user) {
                res.status(404).json([{ object: 'user', message: 'Authentication failed. User not found.' }]);
            } else if (user) {
                if (user.password !== req.body.password) {
                    res.status(422).json([{ field: 'password', message: 'Wrong email or password' }]);
                } else {
                    let token = jwt.sign(user, process.env.SECRET, {
                        expiresIn: '1 day'
                    });

                    res.status(200).json({ token: token });
                }
            }
        })
    };

    // TODO: После регистрации пользователя должен сгенерироваться token - доделать
    this.register = function(req, res, next) {

        /**
         * Make the increment in collection "idCounters" and transmits
         * its own id in the function for creating a new user
         */
        IdCountersModel.getInc('user', 1, function(err, cuouters) {
            if (err) {
                logger.error(err);
                return next(err);
            }

            req.body._id = cuouters.user;

            new UserModel(req.body).save(function(err, user) {
                if (err) {
                    logger.error(err);
                    err.status = 422;

                    IdCountersModel.getInc('user', -1, function(err) {
                        if (err) {
                            logger.error(err);
                            return next(err);
                        }
                    });

                    return next(err);
                }

                logger.info(`User registration is successful:\n${user}`);
                res.status(200).json(user);
            });
        });
    };
};