const Order = require('../models/transactionDetail');
const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');
const { success, errorMessage } = require('../helper/response');

async function addToCart(req, res){
    const userCart = await User.findOne({_id:req.user._id});
    if(!userCart) return res.status(420).json(errorMessage("Cannot find user"));
    
    // Find Product
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
        newCart.forEach(function(element){
                    element.product
        })
       
        const result = await User.findByIdAndUpdate(req.user._id, userCart);
        if(!result) return res.status(422).json(errorMessage("failed to add product to cart"));

        res.status(200).json(success(result, "success add to cart"))
    }
    else{
        res.status(423).json(errorMessage("cannot find product"))
    }
}


// 2. add Cart to Order
async function addToOrder(req, res){
    let user = await User.findById(req.user._id);
    if(!user) return res.status(420).json(errorMessage("cannot find user"));

    let cart = await Cart.findById(req.body.cart);
    if(!cart) return res.status(421).json(errorMessage("cannot find cart"));

    // confirm new order
    let total = 0
    const newOrder = new Order({user: req.user._id, cart:  cart, totalPrice: cart.subprice + total})
    const result = await newOrder.save()
    
    if(!result) return res.status(422).json(errorMessage("failed to save"));

    res.status(200).json(success(result, "Success confirmation Cart"))
}

// 3. get All Order
async function getAllOrder(req, res){
    const populateQuery = [{path:'user', select: 'name'}, {path:'cart', select: 'product'}];
    let order = await Order.find({}).populate(populateQuery)

    res.status(200).json(success(order, "order list"))
}


// 4. Find Order By ID
async function orderShow(req, res){
    let user = await User.findById(req.user._id)
    if(!user) return res.status(421).json(errorMessage("cannot find user"));

    const showById = await Order.findById(req.params.id).populate();
    if(!showById) return res.status(422).json(errorMessage("cannot find Order"));

    res.status(200).json(success(showById, "here is order list:"))
}


// 5. Update Order By Id
async function updateOrder(req, res){
    let user = await User.findById(req.user._id);
    if(!user) return res.status(420).json(errorMessage("cannot find user"));

    let cart = await Cart.findById(req.body.cart);
    if(!cart) return res.status(421).json(errorMessage("cannot find cart"));
    console.log(cart.subprice)
    let order = await Order.findById(req.params.id);
    if(!order) return res.status(422).json(errorMessage("cannot find order"));
    
    let price = order.totalPrice
    const update_order = await Order.findByIdAndUpdate(req.params.id, {
        $push: {user: req.user._id, cart: req.body.cart, totalPrice: cart.subprice + price}
    }, {new: true})

    res.status(200).json(success(update_order, "success update"))
}

module.exports = { addToCart, addToOrder, getAllOrder, orderShow, updateOrder };

