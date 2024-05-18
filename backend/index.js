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
const orderRoute = require('./routes/order')

app.use('/user',userRoute)
app.use('/expenses',expenseRoute)
app.use('/order',orderRoute)

const db = require("./utils/database")
const user = require("./models/user");
const expense = require("./models/expense")
const order = require('./models/order')

user.hasMany(expense,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})
expense.belongsTo(user,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})

user.hasMany(order,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})
order.belongsTo(user,{onDelete : 'CASCADE',onUpdate : 'CASCADE'})

db.sync()
  .then((res) => {
    app.listen(3000, () => {
      console.log("Server Started");
    });
  })
  .catch((err) => {
    console.log(err);
  });
