'use strict';

const winston = require('winston');
const chalk = require('chalk');
const _ = require('lodash');

let colorSchema, cs;

colorSchema = cs = {
    info: chalk.green,
    warn: chalk.yellow,
    debug: chalk.blue,
    error: chalk.red
};

module.exports = function(module) {
    let path = chalk.gray( `[ ${module.filename.split('/').slice(-2).join('/')} ]` );
    let date = chalk.magenta( new Date().toTimeString().slice(0, 8) );

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                timestamp: () => date,
                level: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'debug' : 'info',
                label: path,
                formatter: function(options) {
                    let { timestamp, level, label, message, meta } = options;
                    meta = meta && Object.keys(meta).length ? '\n\t'+ JSON.stringify(meta) : '';

                    return `${ timestamp() } - [${ cs[level]['bold']( level.toUpperCase() ) }]: ${ label } -> ${ cs[level](message ? message : '') }${ cs[level](meta) }`;
                }
            })
        ]
    });

};