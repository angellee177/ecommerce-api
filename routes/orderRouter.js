const router = require('express').Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.post('/confirm', auth, transactionController.addToOrder);
router.get('/', auth, transactionController.getAllOrder);
router.get('/:id', auth, transactionController.orderShow);
router.put('/update/:id', auth, transactionController.updateOrder);

module.exports = router

