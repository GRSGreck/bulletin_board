'use strict';

const nodemailer = require('nodemailer');
const logger = require('./logger')(module);
const juice = require('juice');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    logged: true
});

module.exports = {
    send: function (
        options = {},
        callback = function () {}
    ) {
        let isDevelopment = (!process.env.NODE_ENV || process.env.NODE_ENV ==='development');

        if (isDevelopment) options.to = process.env.TEST_EMAIL;
        logger.info(`Отправка email на адрес: ${ options.to }`);

        // juice() делаем стили инлайновыми
        options.html = juice(options.html);
        transporter.sendMail(options, callback)
    }
};