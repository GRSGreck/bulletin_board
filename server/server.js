'use strict';

const logger = require('./libs/logger')(module);
const mongoose = require('mongoose');
const express = require('express');

try {
    require('../config/vars.env');
} catch (err) {
    logger.warn(`${ err }`.yellow);
}

require('../config/common');

!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? require('../config/development')
    : require('../config/production');

const app = express();

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_HOST, process.env.DB_NAME, process.env.DB_PORT, {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
});

const db = mongoose.connection;

db.on('open', function() {
    logger.info(`Connecting to a database "${ process.env.DB_NAME }" was completed successfully on port: ${ process.env.DB_PORT }`);

    require('./routes')(app);

    app.listen(process.env.PORT, function() {
        logger.warn(`NODE_ENV: ${ process.env.NODE_ENV ? process.env.NODE_ENV : 'development' }`);
        logger.info(`Server running on port: ${ process.env.PORT }`);
    });
});

db.on('error', (err) => logger.error( [{ title: 'Mongodb connect', message: err.message }] ));