'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true/*,
        unique: true*/
    },
    name: {
        type: String,
        required: true,
        default: 'mr. Nobody'
    },
    email: {
        type: String,
        required: true/*,
        unique: true*/
    },
    password: {
        type: String,
        required: true
    }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;