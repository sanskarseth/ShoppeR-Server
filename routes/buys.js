const auth = require('../middleware/auth');
const { Item } = require('../models/item');
const { User } = require('../models/user');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
	const item = await Item.findById(req.body.itemadd);
	if (!item) return res.status(400).send('Invalid item.');

	if (item.numberInStock === 0)
		return res.status(400).send('Item not in stock.');

	const user = await User.findById(req.user._id);
	if (!user) return res.status(400).send('Invalid user.');

	const finds = _.find(user.cart, { _id: item._id });
	if (finds) return res.status(400).send('Item already in cart.');

	user.cart.push(item);
	await user.save();

	res.send(item);
});

router.get('/', auth, async (req, res) => {
	const user = await User.findById(req.user._id);
	res.send(user.cart);
});

router.delete('/:id', auth, async (req, res) => {
	const user = await User.findById(req.user._id);
	if (!user) return res.status(400).send('Invalid user.');

	const item = await Item.findById(req.params.id);
	if (!item) return res.status(400).send('Invalid item.');

	user.cart = user.cart.filter((m) => String(m._id) !== String(item._id));
	await user.save();

	res.send(item);
});

router.delete('/', auth, async (req, res) => {
	const user = await User.findById(req.user._id);
	if (!user) return res.status(400).send('Invalid user.');

	const items = user.cart;

	items.map(async (item) => {
		const it = await Item.findById(item._id);
		it.numberInStock--;
		it.save();
	});

	const element = [];
	element.push(Date.now());
	element.push(items);
	user.history.push(element);

	// console.log(Date(d));

	user.cart = [];

	await user.save();

	res.send(items);
});

module.exports = router;
