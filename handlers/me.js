'use strict';

module.exports = function Me() {
    this.getCurrentUser = function(req, res, next) {
        res.send('Router getCurrentUser');
    };
};