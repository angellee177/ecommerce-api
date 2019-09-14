const router = require('express').Router();
const productController = require('../controllers/productController');
const auth =  require('../middleware/auth');

router.post('/new', auth, productController.createProduct);

module.exports = router
