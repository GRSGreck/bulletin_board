'use strict';

const express = require('express');
const router = express.Router();
const ItemHandler = require('../handlers/item');
const itemHandler = new ItemHandler();

router.get('/', itemHandler.searchItems);

module.exports = router;
