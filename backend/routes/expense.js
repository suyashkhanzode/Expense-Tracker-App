const express = require('express');

const router = express.Router();

const expenseController = require('../controller/expense');

router.get('/:userId/get-expense',expenseController.getExpense);
router.post('/:userId/add-expense',expenseController.addExpense);
router.delete('/:userId/delete-expense/:id',expenseController.deleteExpense);
router.put('/:userId/update-expense/:id',expenseController.updateExpense)

module.exports = router;