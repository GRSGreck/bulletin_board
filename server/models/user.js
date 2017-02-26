'use strict';

const mongoose = require('mongoose');
const logger = require('../libs/logger')(module);
const colors = require('colors');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
        min: 1,
        required: [true, 'Field "{PATH}" is required']
    },
    phone: {
        type: String,
        validate: {
            validator: (value) => /^(\+\d{2})?\d{10}$/.test(value),
            message: '{VALUE} is not a valid phone number (valid phone' +
            'number should be in a "+380991256085" or "0991256085" this format)'
        }
    },
    name: {
        type: String,
        minlength: [3, 'The value of field "{PATH}" ("{VALUE}") is shorter than the minimum allowed length ({MINLENGTH}).'],
        maxlength: [30, 'The value of field "{PATH}" ("{VALUE}") exceeds the maximum allowed length ({MAXLENGTH}).'],
        required: [true, 'Field "{PATH}" is required']
    },
    email: {
        type: String,
        validate: {
            validator: (value) => /^(([^@]|[a-zA-Z\d.+ -]*)(?=@)@([a-zA-Z\d-]*)\.[a-zA-Z]+)$/.test(value),
            message: '{VALUE} is not a valid email address (valid email address to be in "ilovelife@gmail.com"this format)'
        },
        required: [true, 'Field "{PATH}" is required'],
        unique: true
    },
    password: {
        type: String,
        minlength: [6, 'The value of field "{PATH}" ("{VALUE}") is shorter than the minimum allowed length ({MINLENGTH}).'],
        maxlength: [24, 'The value of field "{PATH}" ("{VALUE}") exceeds the maximum allowed length ({MAXLENGTH}).'],
        required: [true, 'Field "{PATH}" is required']
    }
});

UserSchema.pre('save', function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR), function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => cb(err, isMatch));
};

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;