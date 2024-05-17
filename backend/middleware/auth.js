const jwt = require('jsonwebtoken');
const User = require("../models/user");
const secertKey = "ddfygduyfgsdygfdyu56434684%^^&&*)ggd";
exports.authenticate = (req,res,next) =>{
   
    const token = req.headers['authorization'];
    const userId = jwt.verify(token,secertKey);
    User.findOne({
        where :{
            id : userId
        }
    })
    .then((user) =>{
        console.log("User Verified")
         req.userId = userId;
         next();
    })
    .catch((err) =>{
        res.status(500).json({
            message: "An error occurred while searching for the user.",
            error: err
        });
    })
}