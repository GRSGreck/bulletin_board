'use strict';

const logger = require('../libs/logger')(module);
const bodyParser = require('body-parser');
const authRouter = require('./auth');
const meRouter = require('./me');
const userRouter = require('./user');
const itemRouter = require('./item');

module.exports = function(app) {

    app.use(bodyParser.json());

    app.use('/api', authRouter);
    app.use('/api/me', meRouter);
    app.use('/api/user', userRouter);
    app.use('/api/item', itemRouter);

    app.use(function(req, res, next) {
        let err = new Error('Page Not Found');
        err.status = 404;
        next(err);
    });

    // developer error handler
    if (!process.env.NODE_ENV || process.env.NODE_ENV ==='development') {
        return app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.json([{
                status: err.status,
                message: err.message,
                stack: err.stack
            }]);
        });
    }

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json([{
            status: err.status,
            message: err.message
        }]);
    });
};