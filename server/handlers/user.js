'use strict';

const logger = require('../libs/logger')(module);
const UserModel = require('../models/user');
const errors = require('../errors');

module.exports = function User() {
    this.getUserById = function(req, res, next) {
        if (!req.decoded) return;

        if (req.decoded._doc._id !== parseInt(req.params.id)) {
            return next( new errors.HttpError(422, 'Verified user id does not match the requested', '_id', 'id_not_match') );
        }

        UserModel.findById(req.params.id, { new_password_hash: 0, __v: 0 })
            .exec((err, user) => {
                if (err) return next(err);

                if (!user) {
                    let err = new Error('User not found');
                    err.status = 404;

                    return next(err);
                }

                logger.debug(`Get user by id (${ user.id }):\n${ user }`);
                res.status(200).json(user);
            });
    };
    
    this.searchUsers = function(req, res, next) {
        req.query = req.query || {};

        if (req.query.email) req.query.email = new RegExp(req.query.email.trim(), 'i');
        if (req.query.name) req.query.name = new RegExp(req.query.name.trim(), 'i');

        UserModel.find(req.query, { new_password_hash: 0, __v: 0 })
            .exec((err, users) => {
                if (err) return next(err);

                logger.info('Users found in the amount of: ' + users.length);
                res.status(200).json(users);
            });

    }
};