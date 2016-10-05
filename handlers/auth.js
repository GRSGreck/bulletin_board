'use strict';

const UserModel = require('../models/user');
const logger = require('../libs/logger')(module);

module.exports = function Auth() {
    this.home = function(req, res, next) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    };

    this.login = function(req, res, next) {
        res.json(req.body);
    };

    this.register = function(req, res, next) {
        logger.debug('R req.body', req.body);

        var user = new UserModel(req.body);

        user.save(function(err, user) {
            if (err) {
                logger.error(err);

                return next(err);
            }

            logger.info(`User registration is successful:\n${user}`);
            res.status(200).json(user);
        });
    };
};