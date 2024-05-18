const  Order = require('../models/order');
const RazorPay = require('razorpay');

require('dotenv').config();

exports.orderPremium =(req,res,next) =>{
     debugger;
    const rzp = new RazorPay({
        key_id : process.env.ROZORPAY_KEY_ID,
        key_secret : process.env.ROZORPAY_KEY_SECRET
    })

    const amount = 2500;

    rzp.orders.create({amount,currency:'INR'})
    .then((order) =>{
         req.user.createOrder(
         {orderId : order.id,
          status  : "PENDING"
         })
         .then((result) =>{
            res.status(200).json({order,key_id : rzp.key_id });
         })
         .catch((err) =>{
            res.json({ message: err });
        })
        
    })
    .catch((err) =>{
        res.json({ message: err });
    })
}

exports.verifyPayment = (req,res,next) =>{
    try {
        const {order_id,payment_id} = req.body;
    Order.findOne({
        where : {
            orderId : order_id,
           
        }
    })
    .then((order) =>{
         order.update({
            paymentId : payment_id,
            status : "SUCCESSFULL"
         })
         .then(()=>{
             req.user.update({isPremium : true})
             .then(()=>{
                 res.status(202).json({success : true,message : "Transaction Complete"})
             })
         })
    })
    } catch (error) {
        console.log(error)
    }
}