'use strict';

const express = require('express');
const router = express.Router();
const AuthHandler = require('../handlers/auth');
const authHandler = new AuthHandler();

router.post('/login', authHandler.login);
router.post('/register', authHandler.register);

module.exports = router;
