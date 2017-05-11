'use strict';

const mongoose = require('mongoose');
const logger = require('../libs/logger')(module);
const bcrypt = require('bcrypt');
const async = require('async');

let ForgotPasswordSchema = mongoose.Schema({
    email: {
        type: String,
        validate: {
            validator: (value) => /^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/.test(value),
            message: '{VALUE} is invalid email address (valid email address to be in "ilovelife@gmail.com" this format)',
            type: 'pattern_email'
        },
        required: [true, 'Field "{PATH}" is required'],
        unique: true
    },
    hash: {
        type: String,
        required: [true, 'Field "{PATH}" is required']
    },
    new_password_hash: {
        type: String,
        required: true
    }
});

ForgotPasswordSchema.virtual('new_password')
    .get(function() {
        return this._new_password;
    })
    .set(function(value) {
        this._new_password = value;
        let salt = bcrypt.genSaltSync( parseInt(process.env.SALT_WORK_FACTOR) );
        this.new_password_hash = bcrypt.hashSync(value, salt);
    });

ForgotPasswordSchema.virtual('confirm_password')
    .get(function() {
        return this._confirm_password;
    })
    .set(function(value) {
        this._confirm_password = value
    });

ForgotPasswordSchema.path('new_password_hash').validate(function(value) {
    let new_pwd = this._new_password;
    let conf_pwd = this._confirm_password;
    let minLength = process.env.MIN_LENGTH_PWD;
    let maxLength = process.env.MAX_LENGTH_PWD;

    if (!new_pwd) return this.invalidate('new_password', 'Field new_password is required', null, 'required');
    if (!conf_pwd) return this.invalidate('confirm_password', 'Field confirm_password is required', null, 'required');

    if (new_pwd && new_pwd.length < minLength) {
        return this.invalidate('new_password', 'The length of the field "{PATH}" must be greater than {VALUE} characters', minLength, 'minlength');
    } else if (new_pwd && new_pwd.length > maxLength) {
        return this.invalidate('new_password', 'The length of the field "{PATH}" must be less than {VALUE} characters', maxLength, 'maxlength');
    }

    if (conf_pwd && conf_pwd.length < minLength) {
        return this.invalidate('confirm_password', 'The length of the field "{PATH}" must be greater than {VALUE} characters', minLength, 'minlength');
    } else if (conf_pwd && conf_pwd.length > maxLength) {
        return this.invalidate('confirm_password', 'The length of the field "{PATH}" must be less than {VALUE} characters', maxLength, 'maxlength');
    }

    if (new_pwd !== conf_pwd) {
        return this.invalidate('new_password', 'Passwords do not match "new_password" and "confirm_password"', null, 'passwords_not_match');
    }
});

module.exports = mongoose.model('forgot_password', ForgotPasswordSchema);