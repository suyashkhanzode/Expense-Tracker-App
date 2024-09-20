const smtp = require("../utils/nodemailer");
const ForgotPasswordRequest = require("../models/forgotPasswordRequest");
const sequelize = require("../utils/database");
const bycript = require("bcrypt");
const User = require("../models/user");

require("dotenv").config();
const secertKey = process.env.TOKEN_SECRET_KEY;

exports.forgotPassword = async (req, res, next) => {
  const recieverMail = req.body.recieverMail;
  const user = await User.findOne({ where: { email: recieverMail } });
  const userId = user.id;
  const request = await ForgotPasswordRequest.create({ userId: userId });
  debugger;
  const requestUUID = request.id;
  const resetURL = `http://localhost:3000/password/reset-password/${requestUUID}`;
  const html = `Click <a href ="${resetURL}">here</a>`;
  smtp
    .sendEmail(recieverMail, "Reset Password", "Your Reset Password Link", html)
    .then((result) => {
      res.status(200).json({ message: "Please Chech Your Inbox" });
    })
    .catch((err) => [
      res.status(500).json({
        message: "An error occurred while Sendin MAil",
        error: err,
      }),
    ]);
};

exports.resetPassword = async (req, res, next) => {
  const requestUUID = req.params.requestUUID;
  const t = await sequelize.transaction();
  debugger;
  try {
    const request = await ForgotPasswordRequest.findOne(
      { where: { id: requestUUID } },
      { transaction: t }
    );
    if (!request) {
      t.rollback();
      return res
        .status(404)
        .json({ message: "Invalid or expired password reset link" });
    }

    ForgotPasswordRequest.update(
      { isActive: true },
      { where: { id: requestUUID } },
      { transaction: t }
    )
      .then(() => {
        t.commit();
        res
          .status(200)
          .send(
            `<a href="http://127.0.0.1:5500/updatepassword.html?requestUUID=${requestUUID}">Click Here To Update Password</a>`
          );
      })
      .catch((err) => {
        t.rollback();
        console.log(err);
        res.status(500).json({ message: "An error occurred", error: err });
      });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.updatePassword = async (req, res, next) => {
  const newPassword = req.body.newPassword;
  const requestUUID = req.params.requestUUID;

  let t;
  try {
    t = await sequelize.transaction();

    const request = await ForgotPasswordRequest.findOne({
      where: { id: requestUUID },
      transaction: t,
    });

    if (!request) {
      await t.rollback();
      return res.status(404).json({ message: "Invalid or expired password reset link" });
    }

    const user = await User.findOne({where : {id : request.userId}}, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const saltRounds = 10;
    const hashedPassword = bycript.hashSync(newPassword, saltRounds);
    debugger;
    await user.update({ password: hashedPassword }, { transaction: t });
    await request.update({ isActive: false }, { transaction: t });

     await t.commit();
     res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    if (t) await t.rollback();
    res.status(500).json({ message: "An error occurred while updating the password", error: err });
  }
};
