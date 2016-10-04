'use strict';

module.exports = function Item() {
    this.searchItems = function(req, res, next) {
        res.json(req.query);
    };
};