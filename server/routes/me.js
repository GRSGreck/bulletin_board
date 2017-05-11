'use strict';

const MeHandler = require('../handlers/me');
const meHandler = new MeHandler();
const mw = require('../middlewares');
const express = require('express');
const router = express.Router();

router.get('/', mw.verify, meHandler.getMe);
router.get('/verify-user/resend', meHandler.verifyUserResend);
router.put('/profile', mw.verify, meHandler.updateProfile);
router.put('/email', mw.verify, meHandler.changeEmail);
router.put('/change-password', mw.verify, meHandler.changePassword);

module.exports = router;
