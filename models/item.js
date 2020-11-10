const Joi = require('joi');
const mongoose = require('mongoose');
const { categorySchema } = require('./category');

const itemSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		minlength: 5,
		maxlength: 255,
	},
	category: {
		type: categorySchema,
		required: true,
	},
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
		max: 10000,
	},
});

const Item = mongoose.model('Items', itemSchema);

function validateItem(item) {
	const schema = {
		title: Joi.string().min(5).max(50).required(),
		categoryId: Joi.objectId().required(),
		numberInStock: Joi.number().min(0).required(),
		price: Joi.number().min(0).required(),
	};

	return Joi.validate(item, schema);
}

exports.Item = Item;
exports.validate = validateItem;
exports.itemSchema = itemSchema;
