const express = require('express');

const passwordController = require('../controller/password');
const auth = require('../middleware/auth')

const router = express.Router();

router.post('/forgot-password',auth.authenticate,passwordController.forgotPassword);
router.get('/reset-password/:requestUUID',passwordController.resetPassword);
router.get('/update-password',auth.authenticate,passwordController.resetPassword);

module.exports = router;