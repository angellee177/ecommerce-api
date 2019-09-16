const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema (
    {
        user: {type: Schema.Types.ObjectId, ref: "User"},
        product: {type: Schema.Types.ObjectId, ref: "Product"},
        qty:{
            type: Number,
            required: true
        },
        subprice: {
            type: Number
        }
    }
)


const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

