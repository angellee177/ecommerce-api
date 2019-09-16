const server = require('../index');
const chai = require('chai');
const chaihttp = require('chai-http');
const should = chai.should();
// get User Model
const User = require('../models/user');
// get Product Model
const Product = require('../models/product');
// get Order
const Order = require('../models/transactionDetail');

chai.use(chaihttp);
chai.should();


after(done => {
    Order.deleteMany({})
        .then(result => {
            done();
        })
        .catch(err => {
            console.log(err)
        })
})
