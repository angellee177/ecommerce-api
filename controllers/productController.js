const Product = require("../models/product");
const { success, errorMessage } = require("../helper/response");
const User = require('../models/user');

// 1. Create new Product
async function createProduct(req, res){
    let user = await User.findById(req.user._id)

    const product = new Product({name: req.body.name, description: req.body.description, 
    price: req.body.price, stock: req.body.stock, user: req.user._id})
    const result = await product.save();
    console.log(result)
    // save to User Schema
    user.product.push(product);
    await user.save();

    res.status(200).json(success(result, "success create new product!"));
}


// 2. Show Product List
async function showProduct(req, res){
    const productList = await Product.find({})
    res.status(200).json(success(productList, "here is your Product List: "))
}


// 3. Show Product By ID
async function showProductID(req, res){
    let user = await User.findById(req.user._id)
    if(!user) return res.status(421).json(errorMessage("cannot find user"));

    const product_detail = await Product.findById(req.params.id);
    if(!product_detail) return res.status(422).json(errorMessage("cannot find product"));

    res.status(200).json(success(product_detail, "detail product:"));
}


// 4. Update Product By Id
async function updateProduct(req, res){
    let user = await User.findById(req.user._id)
    if(!user) return res.status(421).json(errorMessage("cannot find user"));

    const update_product = await Product.findByIdAndUpdate(req.params.id, {
        $set: {name: req.body.name, description: req.body.description, 
        price: req.body.price, stock: req.body.stock, user: req.user._id}
    },{new: true}.populate("user", "name"))
    // if cannot find product with parameter ID
    if(!update_product) return res.status(422).json(errorMessage("failed to update product"));

    res.status(200).json(success(update_product, "successfully update product"))
}


// 5. Delete Product
function removeProduct(product, elem){
    var index = product.indexOf(elem);
    if(index > -1){
        product.splice(index, 1);
    }
}

async function deleteProduct(req, res){
    let product = await Product.findById(req.params.id);
    console.log(product)

    let user = await User.findOne({product: req.params.id})
    if(!user) return res.status(421).json(errorMessage("cannot find product in user"))
    // delete product from User profile
    removeProduct(user.product, product._id);

    //  delete Product from Product Index
    const delete_product = await Product.findByIdAndDelete(req.params.id)
    if(!delete_product) return res.status(422).json(errorMessage("failed to delete"));

    res.status(200).json(success(delete_product, "success delete product"))
}


module.exports = { createProduct, showProduct, showProductID, updateProduct, deleteProduct }

