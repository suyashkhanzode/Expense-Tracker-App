const User = require("../models/user");

exports.signUpUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.create({
    name: name,
    email: email,
    password: password,
  })
    .then((result) => {
      res.status(201).json({ message: result });
    })
    .catch((err) => {
      if (
        err.name === "SequelizeUniqueConstraintError" &&
        err.errors[0].type === "unique violation" &&
        err.errors[0].path === "email"
      ) {
        res.status(400).json({
          message: "User Already Exists. Please Login.",
        });
      }
      res.json({ message: err });
    });
};
