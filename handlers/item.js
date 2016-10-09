'use strict';

const IdCountersModel = require('../models/idCounters');
const logger = require('../libs/logger')(module);
const ItemModel = require('../models/item');
const mw = require('../middlewares');
const errors = require('../errors');
const _ = require('underscore');
const util = require('util');

module.exports = function Item() {
    this.searchItems = function(req, res, next) {
        req.query = req.query || {};

        if (req.query.title) req.query.title = new RegExp(req.query.title.trim(), 'i');
        if (req.query.user_id) req.query.user_id = parseInt(req.query.user_id);

        if (req.query.order_by && (req.query.order_by === 'price' || req.query.order_by === 'created_at')) {
            req.query.order_by = req.query.order_by.trim().toLowerCase();
        } else req.query.order_by = 'created_at';

        if (req.query.order_type && (req.query.order_type === 'asc' || req.query.order_type === 'desc')) {
            req.query.order_type = req.query.order_type.trim().toLowerCase();
        } else req.query.order_type = 'desc';

        let sort = {};
        sort[req.query.order_by] = req.query.order_type === 'desc' ? -1 : 1;

        let query = _.omit(req.query, 'order_by', 'order_type');

        ItemModel.find(query, { __v: 0 })
            .sort(sort)
            .exec((err, items) => {
                if (err) return next(err);

                logger.debug('Items found in the amount of: ' + items.length);
                res.status(200).json(items);
            });
    };

    this.getItemById = function(req, res, next) {

        ItemModel.findById(req.params.id, { __v: 0 })
            .exec((err, item) => {
                if (err) return next(err);
                if (!item) return res.status(404).json();

                logger.info('It was updated item:\n' + item);
                res.status(200).json(item);
            });
    };

    this.createItem = function(req, res, next) {
        if (!req.decoded) return;


        /**
         * Make the increment in collection "idCounters" and transmits
         * its own id in the function for creating a new user
         */
        IdCountersModel.getInc('item', (err, cuouters) => {
            if (err) {
                return next(err);
            }

            req.body._id = cuouters.item;

            // Create a time stamp in seconds
            req.body.created_at = (Date.now() / 1000).toFixed(0);

            if (req.body.title) req.body.title = req.body.title.toString().trim();

            req.decoded._doc._id = parseInt(req.decoded._doc._id);
            if (req.decoded._doc._id) req.body.user_id = req.decoded._doc._id;

            req.body.price = req.body.price && _.isNumber(req.body.price) ? req.body.price.toFixed(2) : req.body.price;

            if (req.decoded._doc &&_.isObject(req.decoded._doc)) {
                req.body.user = _.omit(req.decoded._doc, 'password', '__v');
            }

            new ItemModel(req.body).save((err, item) => {
                if (err) {
                    err.status = 422;

                    return next(err);
                }
                item = _.omit(item.toObject(), '__v');

                logger.info(`New item successfully created:\n${ util.inspect(item) }`);
                res.status(200).json(item);
            });
        });
    };

    this.deleteItemById = function(req, res, next) {
        if (!req.decoded) return;

        ItemModel.findById(req.params.id)
            .exec((err, item) => {
                if (err) return next(err);
                if (!item) return res.status(404).json();

                item = item.toObject();

                if (item.user_id !== req.decoded._doc._id) return res.status(403).json();

                ItemModel.findByIdAndRemove(req.params.id)
                    .exec((err, item) => {
                        if (err) return next(err);

                        logger.info('It was deleted item id: ' + item._id);
                        res.status(200).json();
                    });
            });
    };

    this.updateItemById = function(req, res, next) {
        if (!req.decoded) return;

        if (req.body.title) req.body.title = req.body.title.toString().trim();
        if (req.body.price && _.isNumber(req.body.price)) req.body.price = req.body.price.toFixed(2);

        ItemModel.findById(req.params.id)
            .exec((err, item) => {
                if (err) {
                    err.status = 422;

                    return next(err);
                }
                if (!item) return res.status(404).json();

                item = item.toObject();

                if (item.user_id !== req.decoded._doc._id) return res.status(403).json();

                ItemModel.findByIdAndUpdate(req.params.id, req.body, {
                    runValidators: true,
                    new: true,
                    fields: { __v: 0 }
                }).exec((err, item) => {
                    if (err) {
                        err.status = 422;

                        return next(err);
                    }

                    logger.info('It was updated item:\n' + item);
                    res.status(200).json(item);
                });

            });

        // P.S. Был вариант сделать еще таким способом, но не смог отловить ошибку 403 (Forbidden)
/*        ItemModel.findOneAndUpdate({ _id: req.params.id,  user_id: req.decoded._doc._id }, req.body, {
            runValidators: true,
            new: true,
            fields: { __v: 0 }
        }).exec((err, item) => {
            if (err) {
                err.status = 422;

                return next(err);
            }

            if (!item) return res.status(404).json();

            logger.info('It was updated item:\n' + item);
            res.status(200).json(item);
        });*/
    };

    this.uploadItemImage = function(req, res, next) {
        if (!req.decoded) return;

        mw.uploadFile(req, res, function(err) {
            if (err) return next( new errors.HttpError(422, err.message, 'image') );

            ItemModel.findById(req.params.id)
                .exec((err, item) => {
                    if (err) {
                        err.status = 422;

                        return next(err);
                    }
                    if (!item) return res.status(404).json();

                    item = item.toObject();

                    if (item.user_id !== req.decoded._doc._id) return res.status(403).json();

                    let body = {
                        image: '/img/upload/' + req.file.filename
                    };

                    ItemModel.findByIdAndUpdate(req.params.id, body, {
                        runValidators: true,
                        new: true,
                        fields: { __v: 0 }
                    }).exec((err, item) => {
                        if (err) {
                            err.status = 422;

                            return next(err);
                        }

                        logger.info('Updated image item:\n' + item);
                        res.status(200).json(item);
                    });
                });
        });
    }
};