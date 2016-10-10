'use strict';

const UserHandler = require('../handlers/user');
const userHandler = new UserHandler();
const mw = require('../middlewares');
const express = require('express');
const router = express.Router();

router.get('/:id', mw.verify, userHandler.getUserById);
router.get('/', userHandler.searchUsers);

module.exports = router;