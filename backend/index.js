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

app.use('/user',userRoute)

const db = require("./models/user");

db.sync()
  .then((res) => {
    app.listen(3000, () => {
      console.log("Server Started");
    });
  })
  .catch((err) => {
    console.log(err);
  });
