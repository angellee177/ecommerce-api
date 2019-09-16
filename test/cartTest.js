const server = require('../index');
const chai = require('chai');
const chaihttp = require('chai-http');
const should = chai.should();
// get User Model
const User = require('../models/user');
// get Product Model
const Cart = require('../models/cart');

chai.use(chaihttp);
chai.should();


after(done => {
    Cart.deleteMany({})
        .then(result => {
            done();
        })
        .catch(err => {
            console.log(err)
        })
})
