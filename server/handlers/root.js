'use strict';

const logger = require('../libs/logger')(module);
const helpers = require('../../config/helpers');
const UserModel = require('../models/user');
const ChangeEmailModel = require('../models/changeEmail');
const ForgotPasswordModel = require('../models/forgotPasswordModel');
const mailer = require('../libs/mailer');
const ejs = require('ejs');
const colors = require('colors');
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

                        if (_.isNull(changeEmailModel)){
                            let err = new Error('Not Found');
                            err.status = 404;
                            return cb(err);
                        }

                        cb(null, changeEmailModel);
                    });
            },

            function (changeEmailModel, cb) {
                ChangeEmailModel.findByIdAndRemove(changeEmailModel._id)
                    .exec((err, item) => {
                        if (err) return cb(err);

                        logger.debug(`It was deleted changeEmailModel id: ${item._id}`.blue);
                        cb(null, changeEmailModel);
                    });
            },

            function (changeEmailModel, cb) {
                let { uid, newEmail, oldEmail } = changeEmailModel;
                UserModel.findByIdAndUpdate(uid, { $set: { email: newEmail } }, {
                    runValidators: true,
                    new: true
                }).exec((err, user) => {
                    if (err) return cb(err);

                    logger.info(`Success updated user: ${ JSON.stringify(user) }`.green);
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

            logger.info(`Email successfully updated`.green);
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

                        if (_.isNull(forgotPasswordModel)){
                            let err = new Error('Not Found');
                            err.status = 404;
                            return cb(err);
                        }

                        cb(null, forgotPasswordModel);
                    });
            },

            function (forgotPasswordModel, cb) {
                ForgotPasswordModel.findByIdAndRemove(forgotPasswordModel._id)
                    .exec((err, item) => {
                        if (err) return cb(err);

                        logger.debug(`It was deleted forgotPasswordModel id: ${item._id}`.blue);
                        cb(null, forgotPasswordModel);
                    });
            },

            function (forgotPasswordModel, cb) {
                let { email, new_password: newPwd } = forgotPasswordModel;

                UserModel.findOneAndUpdate({ email }, { $set: { password: newPwd } }, {
                    runValidators: false,
                    new: true
                }).exec((err, user) => {
                    if (err) return cb(err);

                    logger.info(`Success updated user password: ${ JSON.stringify(user) }`.green);
                    cb(null);
                });
            }
        ], function (err) {
            if (err) {
                if (err.status === 404) return res.redirect(process.env.FRONT_URL + '/not-found');
                if (!err.status) err.status = 400;
                return next(err);
            }

            logger.info(`Password successfully updated`.green);
            res.redirect(process.env.FRONT_URL + '/login');
        });
    }
};