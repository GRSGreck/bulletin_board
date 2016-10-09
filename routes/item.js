'use strict';

const express = require('express');
const router = express.Router();
const ItemHandler = require('../handlers/item');
const itemHandler = new ItemHandler();
const mw = require('../middlewares');

router.get('/', itemHandler.searchItems);
router.get('/:id', itemHandler.getItemById);
router.post('/', mw.verify, itemHandler.createItem);
router.put('/:id', mw.verify, itemHandler.updateItemById);
router.delete('/:id', mw.verify, itemHandler.deleteItemById);

module.exports = router;
