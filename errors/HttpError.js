'use strict';

const util = require('util');
const http = require('http');

function HttpError(status, message, field) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.status = status;
    this.message = message || http.STATUS_CODES[status] || 'Error';
    if (field) this.field = field;
}

util.inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';

module.exports = HttpError;