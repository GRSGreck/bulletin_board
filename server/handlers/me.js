'use strict';

const logger = require('../libs/logger')(module);
const mailer = require('../libs/mailer');
const UserModel = require('../models/user');
const ChangeEmailModel = require('../models/changeEmail');
const VerifyUserModel = require('../models/verifyUserModel');
const errors = require('../errors');
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

    this.updateProfile = function (req, res, next) {
        let {firstName = '', lastName = '', phones = []} = req.body;

        if (firstName) firstName = firstName.trim();
        if (lastName) lastName = lastName.trim();

        phones = _.compact(phones);

        if (phones.length) {
            phones = phones.slice(0, process.env.NUMBER_TELEPHONE_NUMBERS);
            phones = phones.map((phone) => phone.toString().trim());
            
            let invalidPhones = [];

            for (let i = 0; i < phones.length; i++) {
                if ( !/^(\+\d{2})?\d{10}$/.test(phones[i]) ) invalidPhones.push({ phone: phones[i], index: i });
            }

            if (invalidPhones.length) {
                let _invalidPhones = invalidPhones.map((invalidPhone) => invalidPhone.phone).join(', ');
                let message = `"${ _invalidPhones }" is invalid phone number (valid phone number should be in a "+380991256085" or "0991256085" this format)`;
                return next( new errors.HttpError(400, message, 'phones', 'pattern_phones', { invalidValues: invalidPhones }) );
            }
        }

        let data = {firstName, lastName, phones};

        UserModel.findByIdAndUpdate(req.user._id, data, {
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

            logger.info(`It was updated user profile: ${ JSON.stringify(user) }`);
            res.status(200).json(user);
        });
    };

    this.changeEmail = function (req, res, next) {
        let { new_email, password } = req.body;

        if (!new_email) return next( new errors.HttpError(400, 'Field new_email is required', 'new_email', 'required') );
        if (!password) return next( new errors.HttpError(400, 'Field password is required', 'password', 'required') );

        async.waterfall([
            function (cb) {
                req.user.comparePassword(password, (err, isMatch) => {
                    cb( !isMatch ? new errors.HttpError(400, 'Wrong current password', 'password', 'wrong_password') : err );
                });
            },

            function (cb) {
                if ( !_.isString(new_email) ) new_email = new_email.toString();
                new_email = new_email.trim().toLowerCase();

                UserModel.findOne({ email: new_email })
                    .exec((err, user) => cb( user ? new errors.HttpError(400, 'Duplicate email address', 'new_email', 'duplicate_email') : err ));
            },

            function(cb) {
                let hash = uuid.v1({
                    node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
                    clockseq: 0x1234,
                    msecs: Date.now(),
                    nsecs: 5678
                }).replace(/-/g, '');

                let body = { new_email, old_email: req.user.email, uid: req.user.id, hash };

                ChangeEmailModel.update({ uid: req.user.id }, body, {
                    runValidators: true,
                    new: true,
                    upsert: true
                }).exec((err, success) => {
                    if (err) return cb(err);

                    logger.info(`Changing email address. Successful record into a temporary collection: ${ JSON.stringify(success) }`);
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

            logger.info(`Email successfully sent! Result ${ JSON.stringify(result) }`);
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

        if (!pwds.currentPwd) return next( new errors.HttpError(422, 'Field current_password is required', 'current_password', 'required') );

        for (let key in pwds) pwds[key] = pwds[key].toString().trim();

        req.user.comparePassword(pwds.currentPwd, function(err, isMatch) {
            if (err) {
                err.status = 422;
                return next(err);
            }

            if (!isMatch) {
                return next( new errors.HttpError(422, 'Wrong current password', 'current_password', 'wrong_password') );
            }

            if (pwds.newPwd !== pwds.confirmPwd) {
                return next( new errors.HttpError(422, 'Passwords do not match "new_password" and "confirm_password"', 'new_password', 'passwords_not_match'));
            }

            UserModel.findById(req.user._id)
                .exec((err, user) => {
                    if (err) {
                        err.status = 422;
                        return next(err);
                    }

                    user.password = pwds.newPwd;
                    user.confirm_password = pwds.confirmPwd;

                    user.save(function (err, user) {
                        if (err) {
                            err.status = 422;
                            return next(err);
                        }

                        logger.info(`It was updated user password. User _id: ${user._id}`);
                        res.status(200).send({status: 'success', message: 'Success updated password'});
                    });
                });
        });
    };

    this.verifyUserResend = function (req, res, next) {
        let uid = req.user._id;

        async.waterfall([
            (cb) => VerifyUserModel.findOne({ uid }).exec((err, model) => cb(err, model)),

            function(model, cb) {
                let hash = uuid.v1({
                    node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
                    clockseq: 0x1234,
                    msecs: Date.now(),
                    nsecs: 5678
                }).replace(/-/g, '');

                let _verifyUserModel;

                if (model) {
                    model.uid = uid;
                    model.hash = hash;
                    _verifyUserModel = model;
                } else {
                    _verifyUserModel = new VerifyUserModel({ uid, hash })
                }

                _verifyUserModel.save((err, success) => {
                    if (err) return cb(err);

                    logger.info(`Verifying the user. Successful record into a temporary collection: ${ JSON.stringify(success) }`);
                    cb(null, hash);
                });
            },

            function(hash, cb) {
                let path = helpers.root('server', 'templates', 'mailer', 'verify-user.ejs');

                ejs.renderFile(path, {
                    url: `${process.env.BASE_URL}/verify-user?verify=${hash}`
                }, (err, html) => cb(err, html));
            },

            function(html, cb) {
                mailer.send({
                    from: process.env.SMTP_USER,
                    to: req.user.email,
                    subject: 'Verify user',
                    html: html
                }, (err, response) => cb(err));
            }

        ], function(err) {
            if (err) return next(err);
            res.status(200).send({ success: true, message: 'Verify user resend success' });
        });
    };
};