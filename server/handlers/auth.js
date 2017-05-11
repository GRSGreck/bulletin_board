'use strict';

const ForgotPasswordModel = require('../models/forgotPasswordModel');
const IdCountersModel = require('../models/idCounters');
const logger = require('../libs/logger')(module);
const helpers = require('../../config/helpers');
const UserModel = require('../models/user');
const VerifyUserModel = require('../models/verifyUserModel');
const mailer = require('../libs/mailer');
const passport = require('passport');
const errors = require('../errors');
const async = require('async');
const uuid = require('uuid');
const _ = require('lodash');
const ejs = require('ejs');

module.exports = function Auth() {
    this.home = function(req, res, next) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    };

    this.login = function(req, res, next) {
        if (!req.body.email) return next( new errors.HttpError(400, 'Field email is required', 'email', 'required') );
        if (!req.body.password) return next( new errors.HttpError(400, 'Field password is required', 'password', 'required') );

        req.body.email = req.body.email.toString().trim().toLowerCase();
        req.body.password = req.body.password.toString().trim();

        passport.authenticate('local', function (err, user, info) {
            if (err) {
                err.status = 422;
                return next(err);
            }
            if (!user) return next( new errors.HttpError(422, 'Wrong email or password', 'email', 'wrong_email_or_password') );

            req.logIn(user, function (err) {
                if (err) return next(err);

                user = _.omit(user.toObject(), ['__v', 'password_hash']);
                logger.info(`User (id: ${ user._id }) is logged!`);

                return res.status(200).json(user);
            });

        })(req, res, next);
    };

    this.register = function(req, res, next) {

        async.waterfall([
            /*
             * Make the increment in collection "idCounters" and transmits
             * its own id in the function for creating a new user
             */
            cb => IdCountersModel.getInc('user', (err, counters) => cb(err, counters.user)),

            function(uid, cb) {
                req.body = _.pick(req.body, ['email', 'password', 'confirm_password']);

                req.body.email = req.body.email ? req.body.email.toString().trim().toLowerCase() : '';
                req.body.password = req.body.password ? req.body.password.toString().trim() : '';
                req.body.confirm_password = req.body.confirm_password ? req.body.confirm_password.toString().trim() : '';
                req.body._id = uid;

                new UserModel(req.body).save((err, user) => {
                    if (err) {
                        if (err.code && err.code === 11000) {
                            err = new errors.HttpError(400, 'Duplicate email address', 'email', 'duplicate_email');
                        }
                        return cb(err);
                    }
                    cb(null, user);
                });
            },

            (user, cb) => req.logIn(user, (err) => cb(err, user)),

            function(user, cb) {
                let hash = uuid.v1({
                    node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
                    clockseq: 0x1234,
                    msecs: Date.now(),
                    nsecs: 5678
                }).replace(/-/g, '');

                new VerifyUserModel({ uid: user._id, hash }).save((err, model) => cb(err, user, hash));
            },

            function(user, hash, cb) {
                let path = helpers.root('server', 'templates', 'mailer', 'verify-user.ejs');

                ejs.renderFile(path, {
                    url: `${process.env.BASE_URL}/verify-user?verify=${hash}`
                }, (err, html) => cb(err, user, html));
            },

            function(user, html, cb) {
                mailer.send({
                    from: process.env.SMTP_USER,
                    to: user.email,
                    subject: 'Verify user',
                    html: html
                }, (err, response) => cb(err, user));
            }

        ], function(err, user) {
            if (err) {
                err.status = 422;
                return next(err);
            }
            user = _.omit(user.toObject(), ['__v', 'password_hash']);

            logger.info(`New user successfully registered:\n${ JSON.stringify(user) }`);
            logger.info(`User (id: ${ user._id }) is logged!`);

            res.status(200).json(user);
        });

    };

    this.forgotPassword = function (req, res, next) {
        let {
            email: email = '',
            new_password: newPwd = '',
            confirm_password: confPwd = ''
        } = req.body;

        email = email ? email.toString().trim().toLowerCase() : '';
        newPwd = newPwd ? newPwd.toString().trim() : '';
        confPwd = confPwd ? confPwd.toString().trim() : '';

        async.waterfall([

            // Check email for validity with mongoose model
            function (cb) {
                new UserModel({email: email}).validate((err) => {
                    if (!err.errors.email) return cb();
                    err.errors = _.pick(err.errors, 'email');
                    cb(err);
                });
            },

            function (cb) {
                UserModel.findOne({ email: email }).exec((err, user) => {
                    if (err) return cb(err);
                    if (!user) return cb(new errors.HttpError(404, 'User not found', 'email', 'not_found'));
                    cb();
                })
            },

            cb => ForgotPasswordModel.findOne({ email: email }).exec((err, model) => cb(err, model)),

            function(model, cb) {
                let hash = uuid.v1({
                    node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
                    clockseq: 0x1234,
                    msecs: Date.now(),
                    nsecs: 5678
                }).replace(/-/g, '');

                let body = { email, hash, new_password: newPwd, confirm_password: confPwd };

                let _forgotPasswordModel;

                if (model) {
                    model.new_password = newPwd;
                    model.confirm_password = confPwd;
                    model.hash = hash;

                    _forgotPasswordModel = model;
                } else {
                    _forgotPasswordModel = new ForgotPasswordModel(body)
                }

                _forgotPasswordModel.save((err, success) => {
                    if (err) return cb(err);

                    logger.info(`Changing email address. Successful record into a temporary collection: ${ JSON.stringify(success) }`);
                    cb(null, hash);
                });
            },

            function (hash, cb) {
                let path = helpers.root('server', 'templates', 'mailer', 'forgot-password.ejs');

                ejs.renderFile(path, {
                    url: `${process.env.BASE_URL}/forgot-password?verify=${hash}`
                }, (err, html) => cb(err, html));
            },

            function (html, cb) {
                mailer.send({
                    from: process.env.SMTP_USER,
                    to: email,
                    subject: 'Forgot password',
                    html: html
                }, (err, response) => cb(err));
            }
        ], function (err, result) {
            if (err) {
                if (!err.status) err.status = 422;
                return next(err);
            }
            res.send({ success: true, message: 'Email successfully sent!' });
        });
    };

    this.logout = function (req, res, next) {
        req.logout();
        res.status(200).end();
    };
};