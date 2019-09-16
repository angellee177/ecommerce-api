const router = require('express').Router();
const auth = require('../middleware/auth');
const Product = require('../models/product');

// get upload photo
const multer= require('multer');
// to convert buffer from "req.file" to datauri
 const Datauri = require('datauri');
 const datauri = new Datauri();
// require the Cloudinary to upload Media to CLoud Server
const cloudinary = require('cloudinary').v2

// config the CLoudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const upload = multer().single('picture')
const _    = require('lodash');
// Upload Single File
router.post('/upload/:id', upload, auth, function(req, res){
                        const file = datauri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer);
                        cloudinary.uploader.upload(file.content)
                        .then(data =>{
                            console.log(data)
                            Product.findOneAndUpdate({_id: req.params.id},
                                {
                                    $set: {picture: data.url},
                                    
                                }, 
                                {new: true}, 
                                function(err, result){
                                    if(err) return res.status(422).json(err);
                                    
                                   res.status(200).json(_.pick(result, ['_id', 'name', 'description', 'picture', 'price', 'qty']))
                                }
                            )
                            // res.status(200).json(data)
                        })
                        .catch(err => {
                            res.status(422).json(err);
                            })
                    })


module.exports = router;

