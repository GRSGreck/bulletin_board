'use strict';

const express = require('express');
const logger = require('./libs/logger')(module);
const morgan = require('morgan');
const mongoose = require('mongoose');
const util = require('util');

(process.env.NODE_ENV || 'development') && require('./config/development');

const app = express();

const db = mongoose.createConnection(process.env.DB_HOST, process.env.DB_NAME, process.env.DB_PORT, {
    server: {
        socketOptions: { keepAlive: 1 }
    }
});



db.on('open', function() {
    logger.info(`Connecting to a database "${ process.env.DB_NAME }" was completed successfully on port: ${ process.env.DB_PORT }`);

    app.use(morgan('dev'));

    app.get('/user', function(req, res, next) {
        res.json({
            name: {
                first: 'Roman',
                last: 'Grechuk'
            }
        });
    });

    require('./routes')(app);

    app.listen(process.env.PORT, function() {
        logger.warn(`NODE_ENV: ${process.env.port || 'development'}`);
        logger.info('Server running on port:', process.env.PORT);
    });
});

db.on('error', (err) => logger.error( [{ title: 'Mongodb connect', message: err.message }] ));