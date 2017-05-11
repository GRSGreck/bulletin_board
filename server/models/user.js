'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
        min: 1,
        required: [true, 'Field "{PATH}" is required']
    },
    phone: {
        type: String,
        default: '',
        validate: {
            validator: function(value) {
                if (!value) return true;
                return !value && /^(\+\d{2})?\d{10}$/.test(value);
            },
            message: '{VALUE} is invalid phone number (valid phone' +
            'number should be in a "+380991256085" or "0991256085" this format)',
            type: 'pattern_phone'
        }
    },
    firstName: {
        type: String,
        minlength: [3, 'The value of field "{PATH}" ("{VALUE}") is shorter than the minimum allowed length ({MINLENGTH}).'],
        maxlength: [30, 'The value of field "{PATH}" ("{VALUE}") exceeds the maximum allowed length ({MAXLENGTH}).'],
        default: 'mr.'
    },
    lastName: {
        type: String,
        minlength: [3, 'The value of field "{PATH}" ("{VALUE}") is shorter than the minimum allowed length ({MINLENGTH}).'],
        maxlength: [30, 'The value of field "{PATH}" ("{VALUE}") exceeds the maximum allowed length ({MAXLENGTH}).'],
        default: 'Incognito'
    },
    email: {
        type: String,
        validate: {
            validator: (value) => /^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/.test(value),
            message: '{VALUE} is invalid email address (valid email address to be in "ilovelife@gmail.com"this format)',
            type: 'pattern_email'
        },
        required: [true, 'Field "{PATH}" is required'],
        unique: true
    },
    password_hash: {
        type: String,
        required: [true, 'Field "{PATH}" is required']
    },
    verified: {
        type: Boolean,
        default: false
    }
});


UserSchema.virtual('password')
    .get(function() {
        return this._password;
    })
    .set(function(value) {
        this._password = value;
        let salt = bcrypt.genSaltSync( parseInt(process.env.SALT_WORK_FACTOR) );
        this.password_hash = bcrypt.hashSync(value, salt);
    });

UserSchema.virtual('confirm_password')
    .get(function() {
        return this._confirm_password;
    })
    .set(function(value) {
        this._confirm_password = value
    });

UserSchema.path('password_hash').validate(function(value) {
    let pwd = this._password;
    let conf_pwd = this._confirm_password;
    let minLength = process.env.MIN_LENGTH_PWD;
    let maxLength = process.env.MAX_LENGTH_PWD;

    if (!pwd) return this.invalidate('password', 'Field password is required', null, 'required');
    if (!conf_pwd) return this.invalidate('confirm_password', 'Field confirm_password is required', null, 'required');

    if (pwd && pwd.length < minLength) {
        return this.invalidate('password', 'The length of the field "{PATH}" must be greater than {VALUE} characters', minLength, 'minlength');
    } else if (pwd && pwd.length > maxLength) {
        return this.invalidate('password', 'The length of the field "{PATH}" must be less than {VALUE} characters', maxLength, 'maxlength');
    }

    if (conf_pwd && conf_pwd.length < minLength) {
        return this.invalidate('confirm_password', 'The length of the field "{PATH}" must be greater than {VALUE} characters', minLength, 'minlength');
    } else if (conf_pwd && conf_pwd.length > maxLength) {
        return this.invalidate('confirm_password', 'The length of the field "{PATH}" must be less than {VALUE} characters', maxLength, 'maxlength');
    }

    if (pwd !== conf_pwd) {
        return this.invalidate('password', 'Passwords do not match "password" and "confirm_password"', null, 'passwords_not_match');
    }
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password_hash, (err, isMatch) => cb(err, isMatch));
};

module.exports = mongoose.model('user', UserSchema);