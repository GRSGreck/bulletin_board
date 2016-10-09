'use strict';

const express = require('express');
const router = express.Router();
const ItemHandler = require('../handlers/item');
const itemHandler = new ItemHandler();
const mw = require('../middlewares');

router.get('/', itemHandler.searchItems);
router.get('/:id', itemHandler.getItemById);
router.post('/', mw.verify, itemHandler.createItem);

module.exports = router;
