const Joi = require('@hapi/joi');

// for Validate the Register Function
function validationRegister(userSchema){
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string()
    }
    return Joi.validate(userSchema, schema);
}

// // For Validate Login Function
// function validationLogin(userSchema){
//     const schema = {
//         email: Joi.string().required().email(),
//         password: Joi.string().required()
//     }
//     return Joi.validate(userSchema, schema)
// }

// // For validate Product Function
// function validationProduct(productSchema){
//     const schema = {
//         name: Joi.string().required(),
//         description: Joi.string().required(),
//         price: Joi.number().integer(),
//         qty: Joi.number().integer(),
//         picture: Joi.string().required()
//     }
//     return Joi.validate(productSchema, schema)
// }



module.exports = { validationRegister};

