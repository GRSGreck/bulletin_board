'use strict';

const mongoose = require('mongoose');

const VerifyUserSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    uid:  { type: Number, required: true }
});

module.exports = mongoose.model('verify_user', VerifyUserSchema);