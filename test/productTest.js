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


after(done => {
    Product.deleteMany({})
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
        let newProduct = {name: "product test", description: "product description", price: 13000, stock: 20}
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
describe("/GET Product List", ()=> {
    it("should get the Product List", (done)=> {
        chai.request(server)
        .get('/api/product')
        .end((err, res)=> {
            res.should.have.status(200);
            res.body.should.have.property('success').equal(true);
            res.body.should.have.property('message').equal("here is your Product List: ");
            done();
        })
    })
})


// 3. Show Product By Id
describe("/SHOW User by ID", ()=> {
    it("it should show user By Id", (done) =>{
        let newUser = new User({name: "user", email:"show@example.com", password:"password"});
        newUser.save()
        let user_token = newUser.generateAuthToken()
        let token = `bearer ${user_token}`;
        // new User to show by ID
        let product = new Product({name: "test", description: "testing product", price: 15000, stock: 10})
        product.save();
        console.log(product._id)
            chai.request(server)
            .get('/api/product/find/'+ product._id)
            .set("authentication-token", token)
            .end((err, res)=> {
                res.should.have.status(200);
                res.body.should.have.property('success').equal(true);
                res.body.should.have.property('message').equal("detail product:");
                done();
            })
    })
})


// 4. Update Product By Id
describe("/Update Product by ID", ()=> {
    it("it should update Product By Id", (done) =>{
        let newUser = new User({name: "user", email:"delete@example.com", password:"password"});
        newUser.save()
        let user_token = newUser.generateAuthToken()
        let token = `bearer ${user_token}`;
         // new User to update by ID
         let product = new Product({name: "test", description: "testing product", price: 15000, stock: 10})
         product.save();
         console.log(product._id)
            chai.request(server)
            .put('/api/product/update' + product._id)
            .set("authentication-token", token)
            .send({name: "test", description: "update product", price: 35000, stock: 15})
            .end((err, res)=> {
                res.should.have.status(200);
                res.body.should.have.property('success').equal(true);
                res.body.should.have.property('message').equal("successfully update product");
                done();
            })
    })
})


//  5. Delete Product By Id
describe("/DELETE Product by ID", ()=> {
    it("it should delete user By Id", (done) =>{
        let newUser = new User({name: "user", email:"delete@example.com", password:"password"});
        newUser.save()
        let user_token = newUser.generateAuthToken()
        let token = `bearer ${user_token}`;
        // to delete the user
        // new User to update by ID
        let product = new Product({name: "test", description: "testing product", price: 15000, stock: 10})
        product.save();
        console.log(product._id)
            chai.request(server)
            .delete('/api/product/delete/' + product._id)
            .set("authentication-token", token)
            .end((err, res)=> {
                res.should.have.status(200);
                res.body.should.have.property('success').equal(true);
                res.body.should.have.property('message').equal("success delete product");
                done();
            })
    })
})
