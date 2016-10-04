'use strict';

module.exports = function User() {
    this.getById = function(req, res, next) {
        res.send('User getById - req.param.id: ' + req.params.id);
    };
};