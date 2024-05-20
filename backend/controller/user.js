const User = require("../models/user");
const bycript = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secertKey = process.env.TOKEN_SECRET_KEY;

const smtp = require('../utils/sendblue')

function generateAccessToken(user) {
    return jwt.sign({user :user},secertKey)
}

exports.signUpUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const saltRounds = 10;
  bycript.hash(password, saltRounds, (err, hash) => {
    User.create({
      name: name,
      email: email,
      password: hash
    })
      .then((result) => {
        res.status(201).json({status : true});
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
  });
};

exports.loginUser = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Find the user by email
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found with provided email."
            });
        }
         bycript.compare(password, user.password , (err,result) =>{
            if(result)
            {
                res.status(200).json({
                    message: "User authenticated successfully.",
                    token : generateAccessToken(user),
                    isPremiumUSer : user.isPremium
                });
                
            }else{
                res.status(401).json({
                    message: "Invalid password."
                });
            }
         });

        
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while searching for the user.",
            error: error
        });
    }
};

exports.getTotalAmount =(req,res,next) =>{
    User.findAll({
      attributes : ['name','totalAmount'],
      group : ['id'],
      order : [['totalAmount','DESC']]
    })
    .then((result)=>{
       res.status(200).json(result)
    })
    .catch((err)=>{
      res.status(500).json({
        message: "An error occurred while fetching expenses",
        error: err,
      });
    })
}

exports.forgotPassword = (req,res,next) =>{
    const recieverMail = req.body.recieverMail;
    debugger;
    smtp.sendEmail(recieverMail,"Reset Password","Your Reset Password Link")
    .then((result) =>{
      res.status(200).json({message : "Please Chech Your Inbox"})
    })
    .catch((err) =>[
      res.status(500).json({
        message: "An error occurred while Sendin MAil",
        error: err,
      })
    ])
}

