const { Rental, validate } = require('../models/rental');
const { Item } = require('../models/item');
const { Customer } = require('../models/customer');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', auth, async (req, res) => {
	const rentals = await Rental.find().select('-__v').sort('-dateOut');
	res.send(rentals);
});

router.post('/', auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await Customer.findById(req.body.customerId);
	if (!customer) return res.status(400).send('Invalid customer.');

	const item = await Item.findById(req.body.itemId);
	if (!item) return res.status(400).send('Invalid item.');

	if (item.numberInStock === 0)
		return res.status(400).send('Item not in stock.');

	let rental = new Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone,
		},
		item: {
			_id: item._id,
			title: item.title,
			price: item.price,
		},
	});

	try {
		new Fawn.Task()
			.save('rentals', rental)
			.update(
				'items',
				{ _id: item._id },
				{
					$inc: { numberInStock: -1 },
				}
			)
			.run();

		res.send(rental);
	} catch (ex) {
		res.status(500).send('Something failed.');
	}
});

router.get('/:id', [auth], async (req, res) => {
	const rental = await Rental.findById(req.params.id).select('-__v');

	if (!rental)
		return res.status(404).send('The rental with the given ID was not found.');

	res.send(rental);
});

module.exports = router;
