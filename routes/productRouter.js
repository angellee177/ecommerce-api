const router = require('express').Router();
const productController = require('../controllers/productController');
const auth =  require('../middleware/auth');

router.post('/new', auth, productController.createProduct);
router.get('/', productController.showProduct);
router.get('/find/:id', auth, productController.showProductID);
router.put('/update/:id', auth, productController.updateProduct);
router.delete('/delete/:id', auth, productController.deleteProduct);

module.exports = router
