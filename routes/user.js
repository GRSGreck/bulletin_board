'use strict';

const express = require('express');
const router = express.Router();
const UserHandler = require('../handlers/user');
const userHandler = new UserHandler();

router.get('/:id', userHandler.getById);

module.exports = router;