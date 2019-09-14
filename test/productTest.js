const server = require('../index');
const chai = require('chai');
const chaihttp = require('chai-http');
const should = chai.should();
// get User Model
const User = require('../models/user');
// get Product Model
const Product = require('../models/product');

chai.use(chaihttp);
chai.should();


afterEach(done => {
    User.deleteMany({})
        .then(result => {
            done();
        })
        .catch(err => {
            console.log(err)
        })
})


// 1. Create new Product
describe("/POST NEW Product", ()=> {
    it("it should be able to create new Product", (done) =>{
        let newUser = new User({name: "user", email:"delete@example.com", password:"password"});
        newUser.save()
        let user_token = newUser.generateAuthToken()
        let token = `bearer ${user_token}`;
        // new product
        let newProduct = {name: "product test", description: "product description", price: 13000, qty: 20}
            chai.request(server)
            .post('/api/product/new')
            .set("authentication-token", token)
            .send(newProduct)
            .end((err, res)=> {
                res.should.have.status(200);
                res.body.should.have.property('success').equal(true);
                res.body.should.have.property('message').equal("success create new product!");
                done();
            })
    })
})


// 2. Show Product List




