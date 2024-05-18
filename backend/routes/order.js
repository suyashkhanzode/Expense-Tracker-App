const express = require('express');

const router = express.Router();

const orderController = require('../controller/order');
const auth = require('../middleware/auth')

router.get('/buy-primium',auth.authenticate,orderController.orderPremium);

router.post('/verify-payment',auth.authenticate,orderController.verifyPayment);

module.exports = router;