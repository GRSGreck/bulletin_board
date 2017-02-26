'use strict';

const logger = require('../libs/logger')(module);
const mailer = require('../libs/mailer');
const UserModel = require('../models/user');
const ChangeEmailModel = require('../models/changeEmail');
const ForgotPasswordModel = require('../models/forgotPasswordModel');
const errors = require('../errors');
const colors = require('colors');
const util = require('util');
const ejs = require('ejs');
const uuid = require('uuid');
const async = require('async');
const helpers = require('../../config/helpers');
const _ = require('lodash');

module.exports = function Me() {
    this.getMe = function(req, res, next) {
        let user = _.omit(req.user.toObject(), 'password', '__v');
        res.status(200).json(user);
    };

    //TODO: реализовать смену email адреса с подтверждением на эл.почте
    //TODO: отделить логику смены пароля
    // this.updateCurrentUser = function(req, res, next) {
    //     // let { name, phone } = req.body;
    //
    //     logger.debug('R req.user:', req.user.toObject());
    //     logger.debug('R req.user._id:', req.user._id);
    //
    //     if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
    //     if (req.body.phone) req.body.phone = req.body.phone.trim();
    //     if (req.body.name) req.body.name = req.body.name.trim();
    //
    //     if (!req.body.current_password && req.body.new_password) {
    //         return next( new errors.HttpError(422, 'Wrong current_password', 'Current_password') );
    //     } else if (req.body.current_password && !req.body.new_password) {
    //         return next( new errors.HttpError(422, 'Wrong new_password', 'New_password') );
    //     } else {
    //
    //         if (req.body.current_password && req.body.new_password) {
    //             req.body.current_password = req.body.current_password.trim();
    //             req.body.new_password = req.body.new_password.trim();
    //
    //             if (req.user.password !== req.body.current_password) {
    //                 return next( new errors.HttpError(422, 'Existing password does not match the entered', 'current_password') );
    //             }
    //             req.body.password = req.body.new_password;
    //         }
    //
    //         UserModel.findByIdAndUpdate(req.user._id, req.body, {
    //             runValidators: true,
    //             new: true,
    //             fields: {
    //                 password: 0,
    //                 __v: 0
    //             }
    //         }).exec((err, user) => {
    //                 if (err) {
    //                     err.status = 422;
    //
    //                     return next(err);
    //                 }
    //
    //                 logger.info('It was updated user:\n' + user);
    //                 res.status(200).json(user);
    //             });
    //     }
    // };

    this.updateProfile = function (req, res, next) {
        let {name = '', phone = ''} = req.body;

        if (name) name = name.trim();
        if (phone) phone = phone.trim();

        let profile = _.pickBy({name, phone}, (value) => !!value);

        UserModel.findByIdAndUpdate(req.user._id, profile, {
            runValidators: true,
            new: true,
            fields: {
                password: 0,
                __v:0
            }
        }).exec((err, user) => {
            if (err) {
                err.status = 422;
                return next(err);
            }

            logger.info('It was updated user profile:\n' + user);
            res.status(200).json(user);
        });
    };

    this.changeEmail = function (req, res, next) {
        let { email: newEmail, password } = req.body;

        if (!newEmail) return next( new errors.HttpError(400, 'Not set new email address', 'email') );
        if (!password) return next( new errors.HttpError(400, 'Not set password', 'password') );

        async.waterfall([
            function (cb) {
                req.user.comparePassword(password, (err, isMatch) => {
                    cb( !isMatch ? new errors.HttpError(400, 'Incorrect password', 'password') : err );
                });
            },

            function (cb) {
                if ( !_.isString(newEmail) ) newEmail = newEmail.toString();
                newEmail = newEmail.trim().toLowerCase();

                UserModel.findOne({ email: newEmail })
                    .exec((err, user) => cb( user ? new errors.HttpError(400, 'Duplicate email address', 'email') : err ));
            },

            function(cb) {
                let hash = uuid.v1({
                    node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
                    clockseq: 0x1234,
                    msecs: Date.now(),
                    nsecs: 5678
                }).replace(/-/g, '');

                let body = { newEmail, oldEmail: req.user.email, uid: req.user.id, hash };

                ChangeEmailModel.update({ uid: req.user.id }, body, {
                    runValidators: true,
                    new: true,
                    upsert: true
                }).exec((err, success) => {
                    if (err) return cb(err);

                    logger.info(`Changing email address. Successful record into a temporary collection: ${ JSON.stringify(success) }`.green);
                    cb(null, hash);
                });
            },

            function (hash, cb) {
                let path = helpers.root('server', 'templates', 'mailer', 'change-email.ejs');

                ejs.renderFile(path, {
                    url: `${process.env.BASE_URL}/email?verify=${hash}`
                }, (err, html) => cb(err, html));
            },

            function (html, cb) {
                mailer.send({
                    from: process.env.SMTP_USER,
                    to: req.body.email,
                    subject: 'Change email',
                    html: html
                }, (err, response) => cb(err, response));
            }
        ], function (err, result) {
            if (err) {
                if (!err.status) err.status = 422;
                return next(err);
            }

            logger.info(`Email successfully sent! Result ${ JSON.stringify(result) }`.green);
            res.send({ success: true, message: 'Email successfully sent!' });
        });
    };

    this.changePassword = function (req, res, next) {
        let {
            current_password: currentPwd,
            new_password: newPwd,
            confirm_password: confirmPwd
        } = req.body;

        let pwds = { currentPwd, newPwd, confirmPwd };

        if (!pwds.currentPwd) return next( new errors.HttpError(422, 'Fields are missing', 'current_password') );
        if (!pwds.newPwd) return next( new errors.HttpError(422, 'Fields are missing', 'new_password') );
        if (!pwds.confirmPwd) return next( new errors.HttpError(422, 'Fields are missing', 'confirm_password') );

        for (let key in pwds) pwds[key] = pwds[key].toString().trim();

        req.user.comparePassword(pwds.currentPwd, function(err, isMatch) {
            if (err) {
                err.status = 422;
                return next(err);
            }

            if (!isMatch) {
                return next( new errors.HttpError(422, 'Wrong current password', 'current_password') );
            }
            if (pwds.newPwd !== pwds.confirmPwd) {
                return next( new errors.HttpError(422, 'Not the same fields "new_password" and "confirm_password"', 'new_password'));
            }

            UserModel.findById(req.user._id)
                .exec((err, user) => {
                    if (err) {
                        err.status = 422;
                        return next(err);
                    }

                    user.password = pwds.newPwd;
                    user.save(function (err, user) {
                        if (err) {
                            err.status = 422;
                            return next(err);
                        }

                        logger.info(`It was updated user password. User _id: ${user._id}`.green);
                        res.status(200).send({status: 'success', message: 'Success updated password'});
                    });
                });
        });
    };

    this.forgotPassword = function (req, res, next) {
        let {
            email: email,
            new_password: newPwd,
            confirm_password: confirmPwd
        } = req.body;

        if (!email) return next( new errors.HttpError(400, 'Fields are missing', 'email') );
        if (!newPwd) return next( new errors.HttpError(400, 'Fields are missing', 'new_password') );
        if (!confirmPwd) return next( new errors.HttpError(400, 'Fields are missing', 'confirm_password') );

        email = email.toString().trim().toLowerCase();
        newPwd = newPwd.toString().trim();
        confirmPwd = confirmPwd.toString().trim();

        if (newPwd !== confirmPwd) {
            return next( new errors.HttpError(422, 'Not equal fields "new_password" and "confirm_password"', 'new_password'));
        }

        async.waterfall([
            function (cb) {
                ForgotPasswordModel.findOne({ email: email })
                    .exec((err, model) => cb(err, model));
            },

            function(model, cb) {
                let hash = uuid.v1({
                    node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
                    clockseq: 0x1234,
                    msecs: Date.now(),
                    nsecs: 5678
                }).replace(/-/g, '');

                let body = { email, hash, new_password: newPwd };

                let _forgotPasswordModel;

                if (model) {
                    model.new_password = newPwd;
                    model.hash = hash;
                    _forgotPasswordModel = model;
                } else {
                    _forgotPasswordModel = new ForgotPasswordModel(body)
                }

                _forgotPasswordModel.save((err, success) => {
                    if (err) return cb(err);

                    logger.info(`Changing email address. Successful record into a temporary collection: ${ JSON.stringify(success) }`.green);
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
                }, (err, response) => cb(err, response));
            }
        ], function (err, result) {
            if (err) {
                if (!err.status) err.status = 422;
                return next(err);
            }

            logger.info(`Email successfully sent! Result ${ JSON.stringify(result) }`.green);
            res.send({ success: true, message: 'Email successfully sent!' });
        });
    }
};









