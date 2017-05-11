'use strict';

const http = require('http');

class HttpError extends Error {
    constructor(status, message, field, type) {
        super();

        this.status = status;
        this.message = message || http.STATUS_CODES[status] || 'Error';
        this.type = type || 'other';
        this.name = 'HttpError';

        if (field) this.field = field;
    }
}

module.exports = HttpError;