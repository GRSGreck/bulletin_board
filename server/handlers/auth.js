'use strict';

const IdCountersModel = require('../models/idCounters');
const logger = require('../libs/logger')(module);
const UserModel = require('../models/user');
const passport = require('passport');
const _ = require('lodash');

module.exports = function Auth() {
    this.home = function(req, res, next) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    };

    this.login = function(req, res, next) {
        if ( !_.isString(req.body.email) ) req.body.email = req.body.email.toString();
        req.body.email = req.body.email.trim().toLowerCase();

        passport.authenticate('local', function (err, user, info) {
            if (err) {
                err.status = 422;

                return next(err);
            }
            if (!user) return res.status(422).json([{ field: 'email', message: 'Wrong email or password' }]);

            req.logIn(user, function (err) {
                if (err) return next(err);

                user = _.omit(user.toObject(), ['__v', 'password']);
                logger.info(`User (id: ${ user._id }) is logged!`);

                return res.status(200).json(user);
            });

        })(req, res, next);

    };

    this.register = function(req, res, next) {
        /**
         * Make the increment in collection "idCounters" and transmits
         * its own id in the function for creating a new user
         */
        IdCountersModel.getInc('user', (err, cuouters) => {
            if (err) return next(err);

            req.body._id = cuouters.user;
            if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
            if (req.body.password) req.body.password = req.body.password.trim();
            if (req.body.phone) req.body.phone = req.body.phone.trim();
            if (req.body.name) req.body.name = req.body.name.trim();

            new UserModel(req.body).save((err, user) => {
                if (err) {
                    err.status = 422;

                    return next(err);
                }

                logger.info(`New user successfully registered:\n${user}`);

                req.logIn(user, function (err) {
                    if (err) return next(err);

                    user = _.omit(user.toObject(), ['__v', 'password']);
                    logger.info(`User (id: ${ user._id }) is logged!`);

                    return res.status(200).json(user);
                });
            });
        });
    };

    this.logout = function (req, res, next) {
        req.logout();
        res.status(200).end();
    };
};