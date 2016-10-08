'use strict';

const express = require('express');
const router = express.Router();
const UserHandler = require('../handlers/user');
const userHandler = new UserHandler();
const mw = require('../middlewares');

router.get('/:id', mw.verify, userHandler.getUserById);
router.get('/',/* mw.verify,*/ userHandler.searchUsers);

module.exports = router;