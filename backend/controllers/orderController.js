const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

const createOrder = async (req, res) => {
    try{
    const{products, totalAmount, address, paymentId} = req.body;
    if(!products || products.length === 0 || !totalAmount || !address){
        return res.status(400).json({message:"Invalid order data"});
    }
    else{
        const order = new Order({
            user:req.user._id,
            products,
            totalAmount,    
            address,
            paymentId
        });
        await order.save();
        const addressStr = typeof address === 'string' ? address : `${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;
        const message=`Dear ${req.user.name},\n\nYour order with ID ${order._id} has been placed successfully. Total amount: $${totalAmount}\nShipping address: ${addressStr}\n\nWe will notify you once the order is shipped.\n\nThank you for shopping with us!\n\nBest regards,\nShopNest Team`;
       await sendEmail(
            req.user.email,"ShopNest - Order Confirmation",message
        );

        res.status(201).json({message:"Order created successfully", order});
    }
    }catch(error){
        console.error("createOrder error:", error);
        res.status(500).json({message:"Server error"});
    }
};

const myOrders = async (req, res) => {
    try{
        const orders = await Order.find({user: req.user._id}).populate('products.product','name price');
        res.json(orders);
    }catch(error){
        console.error("myOrders error:", error);
        res.status(500).json({message:"Server error"});
    }
};

const getOrders = async (req, res) => {
    try{
        const orders = await Order.find({}).populate('user','name email').populate('products.product','name price');
        res.json(orders);
    }catch(error){
        console.error("getOrders error:", error);
        res.status(500).json({message:"Server error"});
    }
};

const updateOrderStatus = async (req, res) => {
    try{
        const {status} = req.body;
        const order = await Order.findById(req.params.id);
        if(order){
            order.status = status;
            await order.save();
            res.json({message:"Order status updated successfully"});
        }else{
            res.status(404).json({message:"Order not found"});
        }
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};

module.exports = {createOrder,myOrders,getOrders,updateOrderStatus};
