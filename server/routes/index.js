'use strict';

const logger = require('../libs/logger')(module);
const bodyParser = require('body-parser');
const authRouter = require('./auth');
const userRouter = require('./user');
const itemRouter = require('./item');
const errors = require('../errors');
const meRouter = require('./me');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require("passport");

module.exports = function(app) {
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.session({
        secret: process.env.SECRET/*,
        cookie: { secure: true }*/
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(morgan('dev'));

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