const express = require("express");

const app = express();

app.use(express.json());

app.use((request, response, next)=>{
   response.setHeader('Access-Control-Allow-Origin',"*");
   response.setHeader('Access-Control-Allow-Headers',
   "*");
   response.setHeader('Access-Control-Allow-Methods',"*")

   next();
});

const userRoute = require('./routes/user')
const expenseRoute = require('./routes/expense')

app.use('/user',userRoute)
app.use('/expenses',expenseRoute)

const db = require("./utils/database")
const user = require("./models/user");
const expense = require("./models/expense")

user.hasOne(expense,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})
expense.belongsTo(user,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})

db.sync()
  .then((res) => {
    app.listen(3000, () => {
      console.log("Server Started");
    });
  })
  .catch((err) => {
    console.log(err);
  });
