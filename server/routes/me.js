'use strict';

const MeHandler = require('../handlers/me');
const meHandler = new MeHandler();
const mw = require('../middlewares');
const express = require('express');
const router = express.Router();

router.get('/', mw.verify, meHandler.getMe);
router.put('/', mw.verify, meHandler.updateCurrentUser);

module.exports = router;
