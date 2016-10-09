'use strict';

const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../img/upload'),
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err);

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});
const upload = multer({
    storage:  storage,

    // fileSize 24 mb
    limits: { fileSize: 24000000 }
}).single('image');

module.exports = upload;