'use strict';

const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    _id: {
        type: Number,
        min: 1,
        required: [true, 'Field "{PATH}" is required']
    },
    created_at: {
        type: Number,
        min: 1,
        required: [true, 'Field "{PATH}" is required'],
        default: Math.round(Date.now() / 1000)
    },
    title: {
        type: String,
        minlength: [3, 'The value of field "{PATH}" ("{VALUE}") is shorter than the minimum allowed length ({MINLENGTH}).'],
        maxlength: [30, 'The value of field "{PATH}" ("{VALUE}") exceeds the maximum allowed length ({MAXLENGTH}).'],
        required: [true, 'Field "{PATH}" is required']
    },
    price: {
        type: Number,
        min: 1,
        max: 1000000000,
        required: [true, 'Field "{PATH}" is required']
    },
    image: {
        type: String,
        maxlength: [1000, 'The value of field "{PATH}" ("{VALUE}") exceeds the maximum allowed length ({MAXLENGTH}).'],
        required: [true, 'Field "{PATH}" is required'],
        default: process.env.DEFAULT_IMG
    },
    user_id: {
        type: Number,
        min: 1,
        required: [true, 'Field "{PATH}" is required']
    },
    user: {
        type: Object,
        required: [true, 'Field "{PATH}" is required'],
        default: {}
    }
});

const ItemModel = mongoose.model('item', ItemSchema);

module.exports = ItemModel;