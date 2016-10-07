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
        req.body.email = req.body.email ? req.body.email.toLowerCase() : req.body.email;

        UserModel.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                logger.error(err);
                err.status = 422;

                return next(err);
            }

            getToken(req, res, next, user);
        })
    };

    this.register = function(req, res, next) {

        /**
         * Make the increment in collection "idCounters" and transmits
         * its own id in the function for creating a new user
         */
        IdCountersModel.getInc('user', (err, cuouters) => {
            if (err) {
                logger.error(err);
                return next(err);
            }

            req.body._id = cuouters.user;
            req.body.email = req.body.email ? req.body.email.toLowerCase() : req.body.email;

            new UserModel(req.body).save((err, user) => {
                if (err) {
                    err.status = 422;

                    return next(err);
                }

                getToken(req, res, next, user);

                logger.info(`User registration is successful:\n${user}`);
            });
        });
    };

    function getToken(req, res, next, user) {
        if (!user) {
            res.status(404).json([{ success: false, message: 'Authentication failed. User not found.' }]);
        } else if (user) {
            if (user.password !== req.body.password) {
                res.status(422).json([{ field: 'password', message: 'Wrong email or password' }]);
            } else {
                let token = jwt.sign(user, process.env.SECRET, {
                    expiresIn: '1 day'
                });

                res.set('Authorization', token);
                res.status(200).json({ token: token });
            }
        }
    }
};