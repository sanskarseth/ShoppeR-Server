const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
	customer: {
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true,
				minlength: 5,
				maxlength: 50,
			},
			isGold: {
				type: Boolean,
				default: false,
			},
			phone: {
				type: String,
				required: true,
				minlength: 5,
				maxlength: 50,
			},
		}),
		required: true,
	},
	item: {
		type: new mongoose.Schema({
			title: {
				type: String,
				required: true,
				trim: true,
				minlength: 5,
				maxlength: 255,
			},
			price: {
				type: Number,
				required: true,
				min: 0,
				max: 10000,
			},
		}),
		required: true,
	},
	dateOut: {
		type: Date,
		required: true,
		default: Date.now,
	},
	dateReturned: {
		type: Date,
	},
	rentalFee: {
		type: Number,
		min: 0,
	},
});

rentalSchema.statics.lookup = function (customerId, itemId) {
	return this.findOne({
		'customer._id': customerId,
		'item._id': itemId,
	});
};

rentalSchema.methods.return = function () {
	this.dateReturned = new Date();

	const rentalDays = moment().diff(this.dateOut, 'days');
	this.rentalFee = rentalDays * this.item.price;
};

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
	const schema = {
		customerId: Joi.objectId().required(),
		itemId: Joi.objectId().required(),
	};

	return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
