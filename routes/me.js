'use strict';

const express = require('express');
const router = express.Router();
const MeHandler = require('../handlers/me');
const meHandler = new MeHandler();

router.get('/', meHandler.getCurrentUser);

module.exports = router;
