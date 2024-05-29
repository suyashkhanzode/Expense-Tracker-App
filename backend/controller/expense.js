const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/database");
const AWS = require("aws-sdk");
require("dotenv").config();
const FileURL = require('../models/fileurl');

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
    res
      .status(201)
      .json({ message: "Expense added successfully", expense: newExpense });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "An error occurred", error: err });
  }
};


exports.getExpenses = async (req, res, next) => {
  const userId = req.user.id;
  const page = parseInt(req.params.page)
  const limit = parseInt(req.params.limit);
  const offset = (page - 1) * limit;

  try {
    const expenses = await Expense.findAndCountAll({
      where: { userId: userId },
      limit: limit,
      offset: offset,
    });
 

    res.status(200).json({
      totalItems: expenses.count,
      totalPages: Math.ceil(expenses.count / limit),
      currentPage: page,
      expenses: expenses.rows
    });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred', error: err });
  }
};

exports.getExpensesReport = async (req, res, next) => {
  const userId = req.user.id;
  

  try {
    const expenses = await Expense.findAll({
      where: { userId: userId }
    
    });
 
    
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'An error occurred', error: err });
  }
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
    const updatedTotalAmount =
      currentTotalAmount - parseInt(oldExpense.amount) + parseInt(amount);

    await user.update(
      { totalAmount: updatedTotalAmount },
      { where: { id: userId }, transaction: t }
    );

    await t.commit();
    res
      .status(200)
      .json({
        message: "Expense updated successfully",
        expense: updatedExpense,
      });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "An error occurred", error: err });
  }
};


async function uploadFile(data, fileName) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  return new Promise((resolve, reject) => {
    s3.createBucket(() => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
      };

      s3.upload(params, (err, s3Response) => {
        if (err) {
          reject(err);
        } else {
          
          resolve(s3Response.Location);
        }
      });
    });
  });
}

exports.downloadFile = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;

    const allExpense = await req.user.getExpenses();
    const data = JSON.stringify(allExpense);
    const fileName = `expense${userId}/${new Date()}.txt`;
    const fileURL = await uploadFile(data, fileName);
    const fileurl = await FileURL.create({ url : fileURL,userId :userId},{transaction : t});
     
    await t.commit();
    res.json({fileURL : fileURL});
    
  } catch (error) {
    await t.rollback();
    res.json({err : error});
  }

};
