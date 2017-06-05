'use strict';

const http = require('http');
const _ = require('lodash');

class HttpError extends Error {
    constructor(status, message, field, type, reason) {
        super();

        this.status = status;
        this.message = message || http.STATUS_CODES[status] || 'Error';
        this.type = type || 'other';
        this.name = 'HttpError';

        if (reason && _.isObject(reason)) this.reason = reason;

        if (field) this.field = field;
    }
}

module.exports = HttpError;