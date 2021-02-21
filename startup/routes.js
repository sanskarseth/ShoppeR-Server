const express = require('express');
const categories = require('../routes/categories');
const customers = require('../routes/customers');
const items = require('../routes/items');
const users = require('../routes/users');
const auth = require('../routes/auth');
const buys = require('../routes/buys');
const payments = require('../routes/payments');
const error = require('../middleware/error');

module.exports = function (app) {
	app.use(express.json());
	app.use('/api/categories', categories);
	app.use('/api/customers', customers);
	app.use('/api/items', items);
	app.use('/api/users', users);
	app.use('/api/auth', auth);
	app.use('/api/buys', buys);
	app.use('/api/payment', payments);
	app.use(error);
};
