const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Product Schema
const productSchema = new Schema (
    {
        name: {
            type: String,
            required: true,
            lowercase: true
        },
        description: {
            type: String,
            required: true,
            min: 10
        },
        price: {
            type: Number,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        picture: {
            type: String
        },
        user: { type: Schema.Types.ObjectId, ref: "User"}
    }
)

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
