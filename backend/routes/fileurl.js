const express = require('express');

const router = express.Router();

const fileurlController = require('../controller/fileurl');
const auth = require('../middleware/auth')

router.get('/all-files',auth.authenticate,fileurlController.dowloadedFiles)

module.exports = router;