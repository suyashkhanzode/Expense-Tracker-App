const express = require("express");

const helmet = require('helmet');

const morgan = require('morgan');

const path = require('path');
const fs = require('fs');
require('dotenv').config()









const app = express();

app.use(helmet())

app.use(express.json());

app.use((request, response, next)=>{
   response.setHeader('Access-Control-Allow-Origin',"*");
   response.setHeader('Access-Control-Allow-Headers',
   "*");
   response.setHeader('Access-Control-Allow-Methods',"*")

   next();
});

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

const userRoute = require('./routes/user')
const expenseRoute = require('./routes/expense')
const orderRoute = require('./routes/order')
const passwordRoute = require('./routes/password')
const fileurlRoute = require('./routes/fileurl');

app.use('/user',userRoute)
app.use('/expenses',expenseRoute)
app.use('/order',orderRoute)
app.use('/password',passwordRoute)
app.use('/files',fileurlRoute)

const db = require("./utils/database")
const user = require("./models/user");
const expense = require("./models/expense")
const order = require('./models/order')
const forgotpasswordrequest = require('./models/forgotPasswordRequest')
const FileURL = require('./models/fileurl')

user.hasMany(expense,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})
expense.belongsTo(user,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})

user.hasMany(order,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})
order.belongsTo(user,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})

user.hasMany(forgotpasswordrequest,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})
forgotpasswordrequest.belongsTo(user,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})

user.hasMany(FileURL,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})
FileURL.belongsTo(user,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})

const PORT = process.env.PORT || 3000

db.sync()
  .then((res) => {
    app.listen(PORT, () => {
      console.log("Server Started at " + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
