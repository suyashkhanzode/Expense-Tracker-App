const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/database");

exports.addExpense = async (req, res, next) => {
  const { amount, description, category } = req.body;
  const userId = req.user.id;

  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const newExpense = await Expense.create(
      { description, amount, category, userId },
      { transaction: t }
    );

    const currentTotalAmount = parseInt(user.totalAmount) || 0;
    const updatedTotalAmount = currentTotalAmount + parseInt(amount);

    await User.update(
      { totalAmount: updatedTotalAmount },
      { where: { id: userId }, transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: "Expense added successfully", expense: newExpense });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "An error occurred", error: err });
  }
};

exports.getExpense = (req, res, next) => {
  const userId = req.user.id;

  Expense.findAll({ where: { userId } })
    .then((expenses) => res.status(200).json(expenses))
    .catch((err) => res.status(500).json({ message: "An error occurred", error: err }));
};

exports.deleteExpense = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const t = await sequelize.transaction();

  try {
    const expense = await Expense.findOne({ where: { id }, transaction: t });
    if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    const currentTotalAmount = parseInt(req.user.totalAmount) || 0;
    const updatedTotalAmount = currentTotalAmount - parseInt(expense.amount);

    await User.update(
      { totalAmount: updatedTotalAmount },
      { where: { id: userId }, transaction: t }
    );

    await Expense.destroy({ where: { id }, transaction: t });

    await t.commit();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "An error occurred", error: err });
  }
};

exports.updateExpense = async (req, res, next) => {
  const { description, amount, category } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const oldExpense = await Expense.findOne({ where: { id }, transaction: t });
    if (!oldExpense) {
      await t.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    const updatedExpense = await Expense.update(
      { description, amount, category },
      { where: { id }, transaction: t }
    );

    const currentTotalAmount = parseInt(user.totalAmount) || 0;
    const updatedTotalAmount = currentTotalAmount - parseInt(oldExpense.amount) + parseInt(amount);

    await user.update({ totalAmount: updatedTotalAmount }, { where: { id: userId }, transaction: t });

    await t.commit();
    res.status(200).json({ message: "Expense updated successfully", expense: updatedExpense });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "An error occurred", error: err });
  }
};


