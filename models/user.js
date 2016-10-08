'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
        min: 1,
        required: [true, 'Field "{PATH}" number required']
    },
    phone: {
        type: String,
        validate: {
            validator: (value) => /^(\+\d{2})?\d{10}$/.test(value),
            message: '{VALUE} is not a valid phone number (valid phone' +
            'number should be in a "+380991256085" or "0991256085" this format)'
        }/*,
        unique: true*/
    },
    name: {
        type: String,
        minlength: [3, 'The value of field "{PATH}" ("{VALUE}") is shorter than the minimum allowed length ({MINLENGTH}).'],
        maxlength: [30, 'The value of field "{PATH}" ("{VALUE}") exceeds the maximum allowed length ({MAXLENGTH}).'],
        required: [true, 'Field "{PATH}" number required']
    },
    email: {
        type: String,
        validate: {
            validator: (value) => /^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/.test(value),
            message: '{VALUE} is not a valid email address (valid email address to be in "ilovelife@gmail.com"this format)'
        },
        required: [true, 'Field "{PATH}" number required'],
        unique: true
    },
    password: {
        type: String,
        minlength: [6, 'The value of field "{PATH}" ("{VALUE}") is shorter than the minimum allowed length ({MINLENGTH}).'],
        maxlength: [24, 'The value of field "{PATH}" ("{VALUE}") exceeds the maximum allowed length ({MAXLENGTH}).'],
        required: [true, 'Field "{PATH}" number required']
    }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;