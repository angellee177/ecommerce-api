const router = require('express').Router();
const authRoute = require('./authRouter');
const userRoute = require('./userRouter');
const productRoute = require('./productRouter');

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/product', productRoute);

module.exports = router;

