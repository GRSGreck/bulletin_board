'use strict';

const mongoose = require('mongoose');
const logger = require('../libs/logger')(module);
const bcrypt = require('bcrypt');

let ForgotPasswordSchema = mongoose.Schema({
    email: {
        type: String,
        validate: {
            validator: (value) => /^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/.test(value),
            message: '{VALUE} is not a valid email address (valid email address to be in "ilovelife@gmail.com"this format)'
        },
        required: [true, 'Field "{PATH}" is required'],
        unique: true
    },
    hash: {
        type: String,
        required: [true, 'Field "{PATH}" is required']
    },
    new_password: {
        type: String,
        minlength: [6, 'The value of field "{PATH}" ("{VALUE}") is shorter than the minimum allowed length ({MINLENGTH}).'],
        maxlength: [24, 'The value of field "{PATH}" ("{VALUE}") exceeds the maximum allowed length ({MAXLENGTH}).'],
        required: [true, 'Field "{PATH}" is required']
    }
});

ForgotPasswordSchema.pre('save', function (next) {
    let forgotPasswordModel = this;

    // only hash the password if it has been modified (or is new)
    if (!forgotPasswordModel.isModified('new_password')) return next();

    // generate a salt
    bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR), function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(forgotPasswordModel.new_password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            forgotPasswordModel.new_password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('forgot_password', ForgotPasswordSchema);