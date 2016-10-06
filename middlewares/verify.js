'use strict';

const jwt = require('jsonwebtoken');
const logger = require('../libs/logger');

module.exports = function(req, res, next) {
    let token = req.headers.authorization || null;

    if (token) {
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json([{ success: false, message: 'Failed to authenticate token.' }]);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).json([{ success: false, message: 'Forbidden' }]);
    }
};