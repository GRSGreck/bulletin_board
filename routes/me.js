'use strict';

const express = require('express');
const router = express.Router();
const MeHandler = require('../handlers/me');
const meHandler = new MeHandler();
const mw = require('../middlewares');

router.get('/', mw.verify, meHandler.getCurrentUser);
router.put('/', mw.verify, meHandler.updateCurrentUser);

module.exports = router;
