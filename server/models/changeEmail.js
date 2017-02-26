'use strict';

const mongoose = require('mongoose');

const ChangeEmailSchema = new mongoose.Schema({
    newEmail: {
        type: String,
        validate: {
            validator: (value) => /^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/.test(value),
            message: '{VALUE} is not a valid email address (valid email address to be in "ilovelife@gmail.com"this format)'
        },
        required: [true, 'Field "{PATH}" is required'],
        unique: true
    },
    oldEmail: {
        type: String,
        validate: {
            validator: (value) => /^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/.test(value),
            message: '{VALUE} is not a valid email address (valid email address to be in "ilovelife@gmail.com"this format)'
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

module.exports = mongoose.model('change_model', ChangeEmailSchema);