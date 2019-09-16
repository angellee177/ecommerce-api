const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../models/product');

//  Order Schema
const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId, ref: "User"
        },
        summary: [],
        totalPrice: {
            type: Number
        }
    }
)

//  to reduce the stock from cart qty
orderSchema.pre('save', async function (next) {
    let order = this
    let total = 0
    for(let i = 0; i < order.summary.length; i++){
        const product = await Product.findOne({_id: order.summary[i].product._id});
        total = total + order.summary[i].subprice
        product.stock = product.stock - order.summary[i].qty
            product.save().then(()=>{
                if(i === order.summary.length - 1){
                    order.totalPrice = total
                    order.save()
                    return next()
                }
                return
            })
        }
   
})


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;


