const express = require('express');
const categories = require('../routes/categories');
const customers = require('../routes/customers');
const items = require('../routes/items');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const buys = require('../routes/buys');
const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function (app) {
	app.use(express.json());
	app.use('/api/categories', categories);
	app.use('/api/customers', customers);
	app.use('/api/items', items);
	app.use('/api/rentals', rentals);
	app.use('/api/users', users);
	app.use('/api/auth', auth);
	app.use('/api/returns', returns);
	app.use('/api/buys', buys);
	app.use(error);
};
