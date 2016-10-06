'use strict';

const UserModel = require('../models/user');
const IdCountersModel = require('../models/idCounters');
const logger = require('../libs/logger')(module);

module.exports = function Auth() {
    this.home = function(req, res, next) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    };

    this.login = function(req, res, next) {
        res.json(req.body);
    };

    this.register = function(req, res, next) {

        /**
         * Make the increment in collection "idCounters" and transmits
         * its own id in the function for creating a new user
         */
        IdCountersModel.getNextSequence('user', function(err, cuouters) {
            if (err) {
                logger.error(err);
                return next(err);
            }

            req.body._id = cuouters.user;

            new UserModel(req.body).save(function(err, user) {
                if (err) {
                    logger.error(err);
                    return next(err);
                }

                logger.info(`User registration is successful:\n${user}`);
                res.status(200).json(user);
            });
        });

    };
};