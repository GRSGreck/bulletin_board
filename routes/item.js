'use strict';

const ItemHandler = require('../handlers/item');
const itemHandler = new ItemHandler();
const mw = require('../middlewares');
const express = require('express');
const router = express.Router();

router.get('/', itemHandler.searchItems);
router.get('/:id', itemHandler.getItemById);
router.post('/', mw.verify, itemHandler.createItem);
router.put('/:id', mw.verify, itemHandler.updateItemById);
router.delete('/:id', mw.verify, itemHandler.deleteItemById);
router.post('/:id/image', mw.verify, itemHandler.uploadItemImageById);
router.delete('/:id/image', mw.verify, itemHandler.removeItemImageById);

module.exports = router;
