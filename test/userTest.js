const server = require('../index');
const chai = require('chai');
const chaihttp = require('chai-http');
const should = chai.should();
// get User Model
const User = require('../models/user');


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



// 1. to test the root path
describe('/Get the root path', ()=>{
    it("should get the index page", (done)=>{
        chai.request(server)
        .get('/')
        .end((err, res)=>{
            res.should.have.status(200);
            res.body.should.have.property('success').equal(true);
            res.body.should.have.property('message').equal("welcome to API");
            done();
        })
    })
})


// 2. Get the User List
describe("/GET User List", ()=> {
    it("should get the User List", (done)=> {
        chai.request(server)
        .get('/api/user')
        .end((err, res)=> {
            res.should.have.status(200);
            done();
        })
    })
})


let register = {name: "test", email: "angel@test.com", password: "password"};
// 2. Should register New User
describe("/POST Register User", () => {
    it("it should register new User", (done)=> {
            chai.request(server)
            .post('/api/auth/register')
            .send(register)
            .end((err, res)=> {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal("yeay! you are successfully register!");
                done();
                if(err) return res.send({err: err})
            })
    })
})


// 2. Should get Error Status(422)
describe("/POST Register Error Status(422)", () => {
    it("it should get error Messages (422)", (done)=> {
        let register = new User({name: "angel", email: "testing@example.com", password: "password"});
        register.save()
        chai.request(server)
        .post('/api/auth/register')
        .send({name: "angellee", email: "testing@example.com", password: "password"})
        .end((err, res)=> {
            res.should.have.status(422)
            res.body.should.have.property('success').equal(false)
            res.body.should.have.property('message').equal("User already Registered.");
            done();
        })
    })
})


// 3. Should be able to login User
describe("/Login User", () => {
    it("it should be able to let User Login", (done)=> {
        let login = new User({name: "angel", email: "example@testing.com", password: "password"});
        login.save();
        chai.request(server)
        .post('/api/auth/login')
        .send({email: login.email, password: login.password})
        .end((err, res)=> {
            res.should.have.status(200);
            res.body.should.have.property('success').equal(true);
            res.body.should.have.property('message').equal("successfully login")
            done();
        })
    })
})

//  3. Should error status(422) FROM LOGIN
describe("/Login User ERROR (422)", () => {
    it("it should get error status(422) from Login Function", (done) => {
        let login = new User({name: "angel1", email: "example1@test.com", password: "password"});
        login.save();
        chai.request(server)
        .post('/api/auth/login')
        .send({email: "example1@test.com", password: "password1"})
        .end((err, res)=> {
            res.should.have.status(422);
            res.body.should.have.property('success').equal(false);
            res.body.should.have.property('message').equal("wrong password");
            done();
        })
    })
})


//  3. Should error status(421) FROM LOGIN
describe("/Login User ERROR (421)", () => {
    it("it should get error status(421) from Login Function", (done) => {
        let login = new User({name: "angel1", email: "example1@test.com", password: "password"});
        login.save();
        chai.request(server)
        .post('/api/auth/login')
        .send({email: "example11@test.com", password: "password"})
        .end((err, res)=> {
            res.should.have.status(421);
            res.body.should.have.property('success').equal(false);
            res.body.should.have.property('message').equal("Email are not Registered!");
            done();
        })
    })
})



//  4. Testing delete User
describe("/DELETE User by ID", ()=> {
    it("it should delete user By Id", (done) =>{
        let newUser = new User({name: "user", email:"delete@example.com", password:"password"});
        newUser.save()
        let user_token = newUser.generateAuthToken()
        let token = `bearer ${user_token}`;
        // to delete the user
        let user2 = new User({name:"delete 2", email: "delete@example1.com", password: "password"});
        user2.save((err, user2) => {
            chai.request(server)
            .delete('/api/user/delete/' + user2._id)
            .set("authentication-token", token)
            .end((err, res)=> {
                res.should.have.status(200);
                res.body.should.have.property('success').equal(true);
                res.body.should.have.property('message').equal("successfully delete user");
                done();
            })
        })
    })
})


// 4. get ERROR STATUS(422) from Delete Function
describe("/GET error (422) from DELETE function", ()=> {
    it("it should get error status(422)", (done) =>{
        let newUser = new User({name: "user", email:"delete@example.com", password:"password"});
        newUser.save()
        let user_token = newUser.generateAuthToken()
        let token = `bearer ${user_token}`;
        chai.request(server)
        .delete('/api/user/delete/5d7b9b63f310243fc93004e8' )
        .set("authentication-token", token)
        .end((err, res)=> {
            res.should.have.status(422);
            res.body.should.have.property('success').equal(false);
            res.body.should.have.property('message').equal("cannot find user");
            done();
        })
    })
})


// 5. Current User Profile
describe("/GET current User Profile", ()=> {
    it("it should get current user profile", (done)=> {
        let newUser = new User({name: "user", email:"delete@example.com", password:"password"});
        newUser.save()
        let user_token = newUser.generateAuthToken()
        let token = `bearer ${user_token}`;
        chai.request(server)
        .get('/api/auth/profile')
        .set("authentication-token", token)
        .end((err, res)=> {
            res.should.have.status(200);
            res.body.should.have.property('success').equal(true);
            res.body.should.have.property('message').equal("user detail information: ")
            done();
        })
    })
})


// 6. Update User
describe("/Update User by ID", ()=> {
    it("it should update user By Id", (done) =>{
        let newUser = new User({name: "user", email:"delete@example.com", password:"password"});
        newUser.save()
        let user_token = newUser.generateAuthToken()
        let token = `bearer ${user_token}`;
            chai.request(server)
            .put('/api/user/update')
            .set("authentication-token", token)
            .send({name: "update name", email:"update@test.com"})
            .end((err, res)=> {
                res.should.have.status(200);
                res.body.should.have.property('success').equal(true);
                res.body.should.have.property('message').equal("successfully Update User");
                done();
            })
    })
})


// 7. SHOW USER BY ID
describe("/SHOW User by ID", ()=> {
    it("it should show user By Id", (done) =>{
        let newUser = new User({name: "user", email:"show@example.com", password:"password"});
        newUser.save()
        let user_token = newUser.generateAuthToken()
        let token = `bearer ${user_token}`;
        // new User to show by ID
        let user_2 = new User({name: "User 2", email: "show@byId.com", password: "password"})
        user_2.save();
        console.log(user_2._id)
            chai.request(server)
            .get('/api/user/find/'+ user_2._id)
            .set("authentication-token", token)
            .end((err, res)=> {
                res.should.have.status(200);
                res.body.should.have.property('success').equal(true);
                res.body.should.have.property('message').equal("here is the user Information: ");
                done();
            })
    })
})