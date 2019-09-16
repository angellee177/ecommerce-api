const Cart = require('./../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const { success, errorMessage } = require('../helper/response');
const _ = require('lodash');


// 1. Create new Cart
async function newCart(req, res){
    let user = await User.findById({_id:req.user._id});
    if(!user) return res.status(420).json(errorMessage("Cannot find user"));
    // Find Product
    let product = await Product.findById(req.body.product);
    if(!product) return res.status(421).json(errorMessage("Cannot find product"));

    // Check stock product
    if(req.body.qty > product.stock) return res.status(422).json(errorMessage("Product out of stock"))
    
    // Insert into new Cart
    let newCart = new Cart({user: req.user._id, product: product , qty: req.body.qty, subprice: product.price*req.body.qty})
    const result = await newCart.save();

    console.log(newCart)
    user.cart.push(newCart);
    await user.save();

    if(!result) return res.status(423).json(errorMessage("failed to save cart"));
    res.status(200).json(success(result, "success add product to Cart"));
}


// 2. Get All Cart
async function showCart(req, res){
    const populateQuery = [{path:'user', select: 'name'}, {path:'product', select: 'name'}];
    const show_cart = await Cart.find({}).populate(populateQuery)
    res.status(200).json(success(show_cart, "Cart List"))
}


// 3. Update Cart By Id
async function updateCart(req, res){
    let user = await User.findById(req.user._id);
    if(!user) return res.status(421).json(errorMessage("cannot find user"));

    const update_cart =  await Cart.findByIdAndUpdate(req.params.id, {
        $push: {user: req.user._id, product: req.body.product, qty: req.body.qty}
    }, {new: true});
    // if failed to find Cart by ID
    if(!update_cart) return res.status(422).json(errorMessage("cannot find Cart"));

    res.status(200).json(success(update_cart, "success update cart"))
}


// 4. Delete Cart By Id
function removeCart(cart, elem){
    var index = cart.indexOf(elem);
    if(index > -1){
        cart.splice(index, 1);
    }
}

async function deleteCart(req, res){
    let cart = await Cart.findById(req.params.id);

    let user = await User.findOne({cart: req.params.id})
    if(!user) return res.status(421).json(errorMessage("cannot find cart in user"))
    // delete product from User profile
    removeCart(user.cart, cart._id);
    cart._id
    //  delete Product from Product Index
    const delete_cart = await Cart.findByIdAndDelete(req.params.id)
    if(!delete_cart) return res.status(422).json(errorMessage("failed to delete"));

    res.status(200).json(success(delete_cart, "success delete cart"))
}

module.exports = { newCart, showCart, updateCart, deleteCart };

