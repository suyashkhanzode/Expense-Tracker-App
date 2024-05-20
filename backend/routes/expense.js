const express = require('express');

const router = express.Router();

const expenseController = require('../controller/expense');
const auth = require('../middleware/auth')

router.get('/get-expense',auth.authenticate,expenseController.getExpense);
router.post('/add-expense',auth.authenticate,expenseController.addExpense);
router.delete('/delete-expense/:id',auth.authenticate,expenseController.deleteExpense);
router.put('/update-expense/:id',auth.authenticate,expenseController.updateExpense)



module.exports = router;