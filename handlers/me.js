'use strict';

const UserModel = require('../models/user');
const logger = require('../libs/logger')(module);

module.exports = function Me() {
    this.getCurrentUser = function(req, res, next) {
        logger.debug('req.params.id', req.params.id);

        UserModel.findById(req.params.id).exec(function(err, user) {
            if (err) {
                logger.error(err);
                return res.status(401).json();
            }

            if (!user) {
                let err = new Error('Unauthorized');
                err.status = 401;

                logger.error(err);
                return res.status(err.status).json();
            }

            res.status(200).json(user);
        });
    };
};