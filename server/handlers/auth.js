'use strict';

const IdCountersModel = require('../models/idCounters');
const logger = require('../libs/logger')(module);
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = function Auth() {
    this.home = function(req, res, next) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    };

    this.login = function(req, res, next) {
        if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
        if (req.body.password) req.body.password = req.body.password.trim();

        UserModel.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
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
                getToken(req, res, next, user);
            });
        });
    };

    function getToken(req, res, next, user) {
        if (!user) {
            res.status(422).json([{ field: 'email', message: 'Wrong email or password' }]);
        } else if (user) {

            if (user.password !== req.body.password) {
                res.status(422).json([{ field: 'password', message: 'Wrong email or password' }]);
            } else {
                let token = jwt.sign(user, process.env.SECRET, {
                    expiresIn: '1 day'
                });

                logger.info(`User (id: ${ user._id }) is logged!`);
                res.set('Authorization', token);
                res.status(200).json({ token: token });
            }
        }
    }
};