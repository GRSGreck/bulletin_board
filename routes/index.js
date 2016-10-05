'use strict';

const logger = require('../libs/logger')(module);
const bodyParser = require('body-parser');
const authRouter = require('./auth');
const meRouter = require('./me');
const userRouter = require('./user');
const itemRouter = require('./item');

module.exports = function(app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/', (req, res) => res.send(`Hello! The API is at http://localhost:${process.env.PORT}/api`));
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
            err.status = err.status || 500;
            res.status(err.status).json([{
                status: err.status,
                message: err.message,
                stack: err.stack
            }]);
        });
    }

    app.use(function(err, req, res, next) {
        err.status = err.status || 500;
        res.status(err.status);
        res.json([{
            status: err.status,
            message: err.message
        }]);
    });
};