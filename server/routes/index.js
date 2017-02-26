'use strict';

const logger = require('../libs/logger')(module);
const bodyParser = require('body-parser');
const rootRouter = require('./root');
const authRouter = require('./auth');
const userRouter = require('./user');
const itemRouter = require('./item');
const errors = require('../errors');
const meRouter = require('./me');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require("passport");
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const colors = require('colors');
const _ = require('lodash');

module.exports = function(app) {
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(session({
        store: new RedisStore({ host: '127.0.0.1', port: 6379 }),
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    require('../libs/passport')();

    app.use('', rootRouter);
    app.use('/api', authRouter);
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

        logger.error(JSON.stringify(resultArrErrors).red);
        res.status(err.status).json(resultArrErrors);
    });
};