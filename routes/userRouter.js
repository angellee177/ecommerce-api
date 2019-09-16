const router = require('express').Router();
const userController = require('../controllers/userController');
const transactionController = require('../controllers/transactionController');
const auth =  require('../middleware/auth');

router.get('/', userController.showUserList);
router.get('/find/:id', auth, userController.showUserById);
router.put('/update', auth, userController.updateUser);
router.delete('/delete/:id', auth, userController.deleteUser);

module.exports = router