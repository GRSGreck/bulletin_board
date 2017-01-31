'use strict';

const logger = require('../libs/logger')(module);
const UserModel = require('../models/user');
const errors = require('../errors');
const _ = require('lodash');

module.exports = function Me() {
    this.getMe = function(req, res, next) {
        let user = _.omit(req.user.toObject(), 'password', '__v');
        res.status(200).json(user);
    };

    this.updateCurrentUser = function(req, res, next) {
        if (!req.decoded) return;

        if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
        if (req.body.phone) req.body.phone = req.body.phone.trim();
        if (req.body.name) req.body.name = req.body.name.trim();

        if (!req.body.current_password && req.body.new_password) {
            return next( new errors.HttpError(422, 'Wrong current_password', 'Current_password') );
        } else if (req.body.current_password && !req.body.new_password) {
            return next( new errors.HttpError(422, 'Wrong new_password', 'new_password') );
        } else {

            if (req.body.current_password && req.body.new_password) {
                req.body.current_password = req.body.current_password.trim();
                req.body.new_password = req.body.new_password.trim();

                if (req.decoded._doc.password !== req.body.current_password) {
                    return next( new errors.HttpError(422, 'Existing password does not match the entered', 'current_password') );
                }
                req.body.password = req.body.new_password;
            }

            UserModel.findByIdAndUpdate(req.decoded._doc._id, req.body, {
                runValidators: true,
                new: true,
                fields: {
                    password: 0,
                    __v: 0
                }
            }).exec((err, user) => {
                    if (err) {
                        err.status = 422;

                        return next(err);
                    }

                    logger.info('It was updated user:\n' + user);
                    res.status(200).json(user);
                });
        }
    }
};









