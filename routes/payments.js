const express = require('express');
const router = express.Router();
const config = require('config');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');

const key_id = config.get('razorKeyId');
const key_secret = config.get('razorKeySecret');

const PaymentDetailsSchema = mongoose.Schema({
	razorpayDetails: {
		orderId: String,
		paymentId: String,
		signature: String,
	},
	success: Boolean,
});

const PaymentDetails = mongoose.model('PatmentDetail', PaymentDetailsSchema);

router.post('/orders', async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: key_id,
			key_secret: key_secret,
		});

		const options = {
			amount: req.body.amount, // amount in smallest currency unit
			currency: 'INR',
			receipt: req.body.orderId,
		};

		const order = await instance.orders.create(options);

		if (!order) return res.status(500).send('Some error occured');

		res.json(order);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post('/success', async (req, res) => {
	try {
		const {
			orderCreationId,
			razorpayPaymentId,
			razorpayOrderId,
			razorpaySignature,
		} = req.body;

		const shasum = crypto.createHmac('sha256', key_secret);
		shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
		const digest = shasum.digest('hex');

		if (digest !== razorpaySignature)
			return res.status(400).json({ msg: 'Transaction not legit!' });

		const newPayment = PaymentDetails({
			razorpayDetails: {
				orderId: razorpayOrderId,
				paymentId: razorpayPaymentId,
				signature: razorpaySignature,
			},
			success: true,
		});

		await newPayment.save();

		res.json({
			msg: 'success',
			orderId: razorpayOrderId,
			paymentId: razorpayPaymentId,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
