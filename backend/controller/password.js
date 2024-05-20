
const smtp = require('../utils/sendblue')
const ForgotPasswordRequest = require('../models/forgotPasswordRequest')
const sequelize = require("../utils/database");
const bycript = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secertKey = process.env.TOKEN_SECRET_KEY;


exports.forgotPassword = async (req,res,next) =>{
    const recieverMail = req.body.recieverMail;
    const userId = req.user.id;
    const request = await ForgotPasswordRequest.create({userId : userId})
    debugger;
    const requestUUID = request.id;
    const resetURL = ` http://localhost:3000/password/reset-password/${requestUUID}`;
    const html = `Click <a href ="${resetURL}">here</a>`
    smtp.sendEmail(recieverMail,"Reset Password","Your Reset Password Link",html)
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

exports.resetPassword = async (req,res,next) =>{
    
    const requestUUID = req.params.requestUUID;
    const t = await sequelize.transaction();
    debugger;
    try {
      const request = await ForgotPasswordRequest.findOne({ where : {id : requestUUID,transaction : t}});
       if(!request)
       {
        t.rollback()
        return res.status(404).json({ message: 'Invalid or expired password reset link' });
       }
     
         ForgotPasswordRequest.update({isActive : true},{where :{ id : requestUUID,transaction :t}})
         .then(() =>{
             t.commit();
             res.status(200).send(`<a href = "http://127.0.0.1:5500/login.html">Click Here To Upadte Password</a>`);
         })
         .catch((err) =>{
            t.rollback();
            console.log(err)
            res.status(500).json({ message: 'An error occurred', error :err });
            
         })

      
     
        
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
    
}

exports.updatePassword = async (req,res,next) =>{
    const newPassword = req.body.newPassword;
    const userId = req.user.id;
}