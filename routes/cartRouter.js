const router = require('express').Router();
const cartController = require('../controllers/cartController');
const auth =require('../middleware/auth');

router.post('/', auth, cartController.newCart);
router.get('/list', cartController.showCart)
router.put('/update/:id', auth, cartController.updateCart);
router.delete('/delete/:id', auth, cartController.deleteCart)

module.exports = router
