const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// get the JWT PrivateKey
const jwt = require('jsonwebtoken');
// get the configuration
const config = require('config');
// to bcrypt the password
const bcrypt =  require('bcryptjs');
const saltRounds  = 10;

// user schema
const userSchema = new Schema (
    {
        name: {
            type: String,
            required: true,
            lowercase: true
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            validate: function (email){
                return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
            }
        },
        password: {
            type: String
        },
        product: [{type: Schema.Types.ObjectId, ref: 'Product'}],
        order: [{type: Schema.Types.ObjectId, ref: "Order"}]
    }
)


// generate token for User
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, name: this.name, email: this.email, password: this.password}, config.get('jwtPrivateKey'))
    return token;
}


// Bcrypt the Password before saving User Data
userSchema.pre('save', function (next) {
    let user = this
    user.password = bcrypt.hashSync(user.password, saltRounds);
    next()
})


const User = mongoose.model("User", userSchema);

module.exports = User;
