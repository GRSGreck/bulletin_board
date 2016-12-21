'use strict';

const logger = require('../libs/logger');

module.exports = function(req, res, next) {
    req.isAuthenticated() ? next() : res.status(401).json();
};