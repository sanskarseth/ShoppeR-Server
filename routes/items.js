const { Item, validate } = require('../models/item');
const { Category } = require('../models/category');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	const items = await Item.find().select('-__v').sort('name');
	res.send(items);
});

router.post('/', [auth], async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const category = await Category.findById(req.body.categoryId);
	if (!category) return res.status(400).send('Invalid category.');

	const item = new Item({
		title: req.body.title,
		category: {
			_id: category._id,
			name: category.name,
		},
		numberInStock: req.body.numberInStock,
		price: req.body.price,
		publishDate: moment().toJSON(),
	});
	await item.save();
	// console.log(item);

	res.send(item);
});

router.put('/:id', [auth], async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const category = await Category.findById(req.body.categoryId);
	if (!category) return res.status(400).send('Invalid category.');

	const item = await Item.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			category: {
				_id: category._id,
				name: category.name,
			},
			numberInStock: req.body.numberInStock,
			price: req.body.price,
		},
		{ new: true }
	);

	if (!item)
		return res.status(404).send('The item with the given ID was not found.');

	res.send(item);
});

router.delete('/:id', [auth, admin], async (req, res) => {
	const item = await Item.findByIdAndRemove(req.params.id);

	if (!item)
		return res.status(404).send('The item with the given ID was not found.');

	res.send(item);
});

router.get('/:id', validateObjectId, async (req, res) => {
	const item = await Item.findById(req.params.id).select('-__v');

	if (!item)
		return res.status(404).send('The item with the given ID was not found.');

	res.send(item);
});

module.exports = router;
