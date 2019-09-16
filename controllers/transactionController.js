const Order = require('../models/transactionDetail');
const Product = require('../models/product');
const User = require('../models/user');
const { success, errorMessage } = require('../helper/response');

async function addToCart(req, res){
    const userCart = await User.findOne({_id:req.user._id});
    const product = await Product.findOne({_id: req.params.id});
    if(product!==null){
        if(req.params.qty > product.stock) return res.status(421).json(errorMessage("out of stock"))
        
        const cart = {product:product , qty: req.params.qty, subprice: product.price*req.params.qty}
        let isProductAlreadyAdded = false
        const newCart = [... userCart.cart]
        for(let i=0;i<newCart.length-1;i++){
            if(newCart[i].product._id.toString() === product._id.toString()){
                isProductAlreadyAdded = true
                newCart[i] = cart
            }
         }
        if(isProductAlreadyAdded===false){
            newCart.push(cart)        
        }

        userCart.cart = newCart
        
        const result = await User.findByIdAndUpdate(req.user._id, userCart);
        if(!result) return res.status(422).json(errorMessage("failed to add product to cart"));

        res.status(200).json(success(result, "success add to cart"))
    }
    else{
        res.status(666).json(errorMessage("cannot find product"))
    }
}


// add Cart to Order
async function addToOrder(req, res){
    let user = await User.findById(req.user._id);
 
    // get the User cart
    const newOrder = user.cart;

    const result = new Order({user: req.user._id,summary: newOrder});
    await result.save()
    
    res.status(200).json(success(result, "Success confirmation Cart"))
}

// get All Order
async function getAllOrder(req, res){
    let order = await Order.find({})

    res.status(200).json(success(order, "order list"))
}

module.exports = { addToCart, addToOrder, getAllOrder };

