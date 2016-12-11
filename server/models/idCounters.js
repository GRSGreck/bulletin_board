'use strict';

const mongoose = require('mongoose');
const _id = 'counters';

const IdCountersSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: _id
    },
    user: {
        type: Number,
        default: 0
    },
    item: {
        type: Number,
        default: 0
    }
});

/**
 * @param {String} name - field name of the collection which will be produced by the increment
 * @param {Function} callback
 * @returns {Object} object with idCounters
 */
IdCountersSchema.statics.getInc = function(name, callback) {
    let update = { $inc: {} };
    update.$inc[name] = 1;

    return this.findByIdAndUpdate(_id, update, { new: true, upsert: true }, callback);
};

const IdCountersModel = mongoose.model('idCounter', IdCountersSchema);

module.exports = IdCountersModel;