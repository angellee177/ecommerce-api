const router = require('express').Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.post('/confirm', auth, transactionController.addToOrder);
router.get('/', auth, transactionController.getAllOrder);

module.exports = router

