'use strict';

const winston = require('winston');

module.exports = function(module) {
    let path = module.filename.split('/').slice(-2).join('/');
    let date = new Date().toTimeString().slice(0, 8);

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                timestamp: function() {
                    return date;
                },
                colorize: true,
                level: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'debug' : 'error',
                label: path
            })
        ]
    });

};