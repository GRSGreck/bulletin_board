'use strict';

const express = require('express');
const router = express.Router();
const UserHandler = require('../handlers/user');
const userHandler = new UserHandler();
const mw = require('../middlewares');

router.get('/:id', mw.verify, userHandler.getUserById);

module.exports = router;