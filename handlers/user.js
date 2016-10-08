'use strict';

const logger = require('../libs/logger')(module);
const UserModel = require('../models/user');
const errors = require('../errors');
const _ = require('underscore');

module.exports = function User() {
    this.getUserById = function(req, res, next) {
        if (!req.decoded) return;

        if (req.decoded._doc._id !== parseInt(req.params.id)) {
            return next( new errors.HttpError(422, 'Verified user id does not match the requested', '_id') );
        }

        UserModel.findById(req.params.id, { password: 0, __v: 0 })
            .exec((err, user) => {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    let err = new Error('User not found');
                    err.status = 404;

                    return next(err);
                }

                logger.info('It was updated user:\n' + user);
                res.status(200).json(user);
            });
    };
    
    this.searchUsers = function(req, res, next) {
        req.query = req.query || {};

        if (req.query.email) req.query.email = req.query.email.trim().toLowerCase();
        if (req.query.name) req.query.name = req.query.name.trim();

        UserModel.find(req.query, { password: 0, __v: 0 })
            .exec((err, users) => {
                if (err) {
                    return next(err);
                }

                res.status(200).json(users);
            });

    }
};