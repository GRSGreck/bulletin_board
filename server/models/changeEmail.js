'use strict';

const mongoose = require('mongoose');

const ChangeEmailSchema = new mongoose.Schema({
    new_email: {
        type: String,
        validate: {
            validator: (value) => /^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/.test(value),
            message: '{VALUE} is invalid email address (valid email address to be in "ilovelife@gmail.com"this format)',
            type: 'pattern_email'
        },
        required: [true, 'Field "{PATH}" is required'],
        unique: true
    },
    old_email: {
        type: String,
        validate: {
            validator: (value) => /^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/.test(value),
            message: '{VALUE} is invalid email address (valid email address to be in "ilovelife@gmail.com"this format)',
            type: 'pattern_email'
        },
        required: [true, 'Field "{PATH}" is required']
    },
    hash: {
        type: String,
        required: [true, 'Field "{PATH}" is required']
    },
    uid: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('change_email', ChangeEmailSchema);