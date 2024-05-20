const express = require('express');

const userController = require('../controller/user');

const router = express.Router();

router.post('/sign-up',userController.signUpUser)

router.post('/login',userController.loginUser)

router.get('/get-total-amount',userController.getTotalAmount)

router.post('/forgot-password',userController.forgotPassword);

module.exports = router