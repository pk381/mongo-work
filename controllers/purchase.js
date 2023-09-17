const Razorpay = require('razorpay');
const Order = require('../models/order');

const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.purchasePremium =async(req,res,next)=>{

    try{

        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRECT
        })
        const amount=2500;

        const order = await rzp.orders.create({amount,currency:"INR"});

        const newOrder = new Order({
            orderId: order.id,
            status: 'PENDING',
            userId: req.user._id

        });
        await newOrder.save();

        res.status(201).json({order,key_id: rzp.key_id})

    }
    catch(err){
        console.log(err);
    }
}

function generateAccessToken(id){
    return jwt.sign({id: id},'secretKey');
 }

exports.updateOrder = async(req,res,next)=>{
    try{

        const order_id = req.body.order_id;
        const payment_id = req.body.payment_id;
        const userId = req.user._id;

        const order = await Order.findOne({orderId: order_id});
        
        order.paymentId = payment_id;
        order.status = "SUCCESS"

        await order.save();

        req.user.isPremiumUser = true;

        await req.user.save();

        res.status(201).json({message:"transition successfull", token: generateAccessToken(userId)});
    }
    catch(err){
        console.log(err);
    }
}


exports.updateFailure = async(req,res,next)=>{

    const order_id = req.body.order_id;

    const order = await Order.findOne({orderId: order_id});

    order.status = "FAILURE";

    await order.save();
}