'use strict';

const RootHandler = require('../handlers/root');
const rootHandler = new RootHandler();
const express = require('express');
const router = express.Router();

router.get('/email', rootHandler.email);
router.get('/forgot-password', rootHandler.forgotPassword);

module.exports = router;
