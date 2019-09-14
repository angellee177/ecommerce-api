const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userController.newUser);
router.post('/login', userController.LoginUser );
router.get('/profile', auth, userController.currentUser);

module.exports = router;

