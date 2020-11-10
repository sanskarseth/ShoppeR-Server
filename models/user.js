const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const { itemSchema } = require('./item');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024,
	},
	phone: {
		type: String,
		required: true,
		minlength: 10,
		maxlength: 50,
	},
	cart: {
		type: [itemSchema],
	},
	history: {
		type: Array,
	},
	isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			name: this.name,
			email: this.email,
			phone: this.phone,
			isAdmin: this.isAdmin,
			cart: this.cart,
			history: this.history,
		},
		config.get('jwtPrivateKey')
	);
	return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
	const schema = {
		name: Joi.string().min(2).max(50).required(),
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required(),
		phone: Joi.string().min(10).max(50).required(),
	};

	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
