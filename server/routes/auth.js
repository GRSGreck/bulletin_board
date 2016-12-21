'use strict';

const AuthHandler = require('../handlers/auth');
const authHandler = new AuthHandler();
const express = require('express');
const router = express.Router();

router.get('/', authHandler.home);
router.post('/login', authHandler.login);
router.post('/register', authHandler.register);
router.get('/logout', authHandler.logout);

module.exports = router;
