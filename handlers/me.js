'use strict';

const logger = require('../libs/logger')(module);
const UserModel = require('../models/user');

module.exports = function Me() {
    this.getCurrentUser = function(req, res, next) {
        req.decoded && res.status(200).json(req.decoded._doc);
    };
};