'use strict';

const logger = require('../libs/logger')(module);
const helpers = require('../../config/helpers');
const UserModel = require('../models/user');
const ChangeEmailModel = require('../models/changeEmail');
const ForgotPasswordModel = require('../models/forgotPasswordModel');
const VerifyUserModel = require('../models/verifyUserModel');
const mailer = require('../libs/mailer');
const errors = require('../errors');
const uuid = require('uuid');
const ejs = require('ejs');
const async = require('async');
const _ = require('lodash');

module.exports = function () {

    this.email = function (req, res, next) {
        let hash = req.query.verify;

        async.waterfall([
            function (cb) {
                ChangeEmailModel.findOne({ hash })
                    .exec((err, changeEmailModel) => {
                        if (err) return cb(err);
                        if (_.isNull(changeEmailModel)) return cb( new errors.HttpError(404, 'Not Found') );
                        cb(null, changeEmailModel);
                    });
            },

            function (changeEmailModel, cb) {
                ChangeEmailModel.findByIdAndRemove(changeEmailModel._id)
                    .exec((err, item) => {
                        if (err) return cb(err);

                        logger.debug(`It was deleted changeEmailModel id: ${item._id}`);
                        cb(null, changeEmailModel);
                    });
            },

            function (changeEmailModel, cb) {
                let { uid, new_email: newEmail, old_email: oldEmail } = changeEmailModel;

                UserModel.findByIdAndUpdate(uid, { $set: { email: newEmail } }, {
                    runValidators: true,
                    new: true
                }).exec((err, user) => {
                    if (err) return cb(err);

                    logger.info(`Success updated user: ${ JSON.stringify(user) }`);
                    cb(null, oldEmail, newEmail);
                });
            },

            function (oldEmail, newEmail, cb) {
                let path = helpers.root('server', 'templates', 'mailer', 'change-email-old.ejs');
                ejs.renderFile(path, { newEmail }, (err, html) => cb(err, html, oldEmail));
            },

            function (html, oldEmail, cb) {
                mailer.send({
                    from: process.env.SMTP_USER,
                    to: oldEmail,
                    subject: 'Change email',
                    html: html
                }, (err, response) => cb(err));
            }
        ], function (err) {
            if (err) {
                if (err.status === 404) return res.redirect(process.env.FRONT_URL + '/not-found');
                if (!err.status) err.status = 400;
                return next(err);
            }

            logger.info(`Email successfully updated`);
            res.redirect(process.env.FRONT_URL + '/login');
        });
    };

    this.forgotPassword = function (req, res, next) {
        let hash = req.query.verify;

        async.waterfall([
            function (cb) {
                ForgotPasswordModel.findOne({ hash })
                    .exec((err, forgotPasswordModel) => {
                        if (err) return cb(err);
                        if (_.isNull(forgotPasswordModel)) return cb( new errors.HttpError(404, 'Not Found') );
                        cb(null, forgotPasswordModel);
                    });
            },

            function (forgotPasswordModel, cb) {
                ForgotPasswordModel.findByIdAndRemove(forgotPasswordModel._id)
                    .exec((err, item) => {
                        if (err) return cb(err);

                        logger.debug(`It was deleted forgotPasswordModel id: ${item._id}`);
                        cb(null, forgotPasswordModel);
                    });
            },

            function (forgotPasswordModel, cb) {
                let { email, new_password_hash: newPwdHash } = forgotPasswordModel;

                UserModel.findOneAndUpdate({ email }, { $set: { password: newPwdHash } }, {
                    runValidators: false,
                    new: true
                }).exec((err, user) => {
                    if (err) return cb(err);

                    logger.info(`Success updated user password: ${ JSON.stringify(user) }`);
                    cb(null);
                });
            }
        ], function (err) {
            if (err) {
                if (err.status === 404) return res.redirect(process.env.FRONT_URL + '/not-found');
                if (!err.status) err.status = 400;
                return next(err);
            }

            logger.info(`Password successfully updated`);
            res.redirect(process.env.FRONT_URL + '/login');
        });
    };

    this.verifyUser = function (req, res, next) {
        let hash = req.query.verify;

        async.waterfall([
            function (cb) {
                VerifyUserModel.findOne({ hash })
                    .exec((err, verifyUserModel) => {
                        if (err) return cb(err);
                        if (_.isNull(verifyUserModel)) return cb( new errors.HttpError(404, 'Not Found') );
                        cb(null, verifyUserModel);
                    });
            },

            function (verifyUserModel, cb) {
                VerifyUserModel.findByIdAndRemove(verifyUserModel._id)
                    .exec((err, item) => {
                        if (err) return cb(err);

                        logger.debug(`It was deleted verifyUserModel id: ${item._id}`);
                        cb(null, verifyUserModel);
                    });
            },

            function (verifyUserModel, cb) {
                let { uid: _id } = verifyUserModel;

                UserModel.findOneAndUpdate(
                    { _id },
                    { $set: { verified: true } },
                    { runValidators: false, new: true }
                ).exec((err, user) => {
                    if (err) return cb(err);

                    logger.info(`Success updated user verified: ${ JSON.stringify(user) }`);
                    cb(null);
                });
            }
        ], function (err) {
            if (err) {
                if (err.status === 404) return res.redirect(process.env.FRONT_URL + '/not-found');
                if (!err.status) err.status = 400;
                return next(err);
            }

            logger.info(`User successfully verified`);
            res.redirect(process.env.FRONT_URL + '/me');
        });
    };
};