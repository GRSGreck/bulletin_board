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
const cookieSession = require('cookie-session');
const _ = require('lodash');

module.exports = function(app) {
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(cookieSession({
        name: 'sid',
        secret: process.env.SECRET,
        maxAge: 365 * 24 * 60 * 60 * 1000,
        signed: false
    }));

    app.use(function (req, res, next) {
        if (req.body && !req.body.remember_me) req.sessionOptions.maxAge = false;
        next();
    });

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

                    if (err.errors.hasOwnProperty(field)) {
                        let error = {
                            field: field,
                            message: err.errors[field].message,
                            type: err.errors[field].kind,
                            stack: err.stack
                        };

                        resultArrErrors.push( isDevelopment ? error : _.omit(error, 'stack'));
                    }
                }
        } else {
            let error = {
                field: err.field || '',
                message: err.message,
                type: err.type || 'other',
                stack: err.stack
            };

            if (err instanceof errors.HttpError) {
                resultArrErrors.push( isDevelopment ? error : _.omit(error, 'stack'));
            } else {
                resultArrErrors.push( isDevelopment ? _.omit(error, 'field') : _.omit(error, ['field', 'stack']));
            }
        }

        logger.error(JSON.stringify(resultArrErrors));
        res.status(err.status).json(resultArrErrors);
    });
};