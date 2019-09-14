const User = require('./../models/user');
const { success, errorMessage } = require('../helper/response');
// pick the variables we need
const _ = require('lodash');
// encrypt the password
const bcrypt = require('bcryptjs');



// 1. Register New User Function
async function newUser(req, res){

    // to check if email already register
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(422).send(errorMessage('User already Registered.'));
    // create new user
    user = new User({name: req.body.name, email: req.body.email, password: req.body.password});
    // save the User
    const result = await user.save();
    // response or output from function    
    res.status(200).json(success(result,"yeay! you are successfully register!"));
}

// 2. Login User Function
async function LoginUser(req, res){
   // check if email are not register
   let user = await User.findOne({ email: req.body.email });
   if (!user) return res.status(421).json(errorMessage('Email are not Registered!'));

   // check if the password that store in DB same with the User input
   const validPassword = await bcrypt.compare(req.body.password, user.password)
   if(!validPassword) return res.status(422).json(errorMessage("wrong password"))
   
   // generate json Token
   const token = user.generateAuthToken();
   res.status(200).json(success({token},"successfully login"))
}


// 3. get the User List
async function showUserList(req, res){
    try{
        let userList = await User.find({})
    
        res.status(200).json(success(userList, "here is your user list"));
    }catch(error){
        console.log('error', error)
    }
}


// 4. Delete User by Id
async function deleteUser(req, res){
    const delete_user = await User.findByIdAndDelete(req.params.id);
    if(!delete_user) return res.status(422).json(errorMessage("cannot find user"))

    res.status(200).json(success(delete_user, "successfully delete user"))
}


// 5. Current User Profile
async function currentUser(req, res){
    try{
        let user = await User.findById(req.user._id);

        res.status(200).json(success(user, "user detail information: "))
    }catch(error){
        console.log(error)
    }
}


//  6. Update User Profile
async function updateUser(req, res){
    const userUpdate = await User.findByIdAndUpdate(req.user._id,
            {
                $set: {name: req.body.name, email: req.body.email, user_type: req.body.user_type}
            }, {new: true}
        );

    res.status(200).json(success(userUpdate, "successfully Update User"))
}


// 7. Show User By Id
async function showUserById(req, res){
    const userId = await User.findById(req.params.id)
    // if invalid id
    if(!userId) return res.status(422).json(errorMessage("cannot find User"));

    res.status(200).json(success(userId, "here is the user Information: "))
}

module.exports = { newUser, LoginUser, showUserList, deleteUser, 
    currentUser, updateUser, showUserById };

