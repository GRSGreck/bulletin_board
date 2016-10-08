'use strict';

const logger = require('../libs/logger')(module);
const bodyParser = require('body-parser');
const authRouter = require('./auth');
const meRouter = require('./me');
const userRouter = require('./user');
const itemRouter = require('./item');
// const mw = require('../middlewares');
const path = require('path');
const _ = require('underscore');
const errors = require('../errors');

module.exports = function(app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    });
    
    // app.get('/', (req, res) => res.send(`Hello! The API is at http://localhost:${process.env.PORT}/api`));
    app.use('/api', authRouter);

    // app.use(mw.verify);
    app.use('/api/me', meRouter);
    app.use('/api/user', userRouter);
    app.use('/api/item', itemRouter);

    app.use(function(req, res, next) {
        let err = new Error('Page Not Found');
        err.status = 404;
        next(err);
    });

    // Error handler
    app.use(function(err, req, res, next) {
        let isDevelopment = (!process.env.NODE_ENV || process.env.NODE_ENV ==='development');
        let resultArrErrors = [];

        err.status = err.status || 500;

        if (err.name && err.name === 'ValidationError') {
                for (let field in err.errors) {
                    isDevelopment
                        ? resultArrErrors.push({ field: field, message: err.errors[field].message, stack: err.stack })
                        : resultArrErrors.push({ field: field, message: err.errors[field].message });
                }
        } else {
            if (err instanceof errors.HttpError) {
                isDevelopment
                    ? resultArrErrors.push({ field: err.field, message: err.message, stack: err.stack })
                    : resultArrErrors.push({ field: err.field, message: err.message });
            } else {
                isDevelopment
                    ? resultArrErrors.push({ success: false, message: err.message, stack: err.stack })
                    : resultArrErrors.push({ success: false, message: err.message });
            }
        }

        logger.error(resultArrErrors);
        res.status(err.status).json(resultArrErrors);
    });
};