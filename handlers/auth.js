'use strict';

module.exports = function Auth() {
    this.login = function(req, res, next) {
        res.json(req.body);
    };

    this.register = function(req, res, next) {
        res.json(req.body);
    };
};