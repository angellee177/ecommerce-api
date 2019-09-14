const router = require('express').Router();
const authRoute = require('./authRouter');
const userRoute = require('./userRouter');


router.use('/auth', authRoute);
router.use('/user', userRoute);

module.exports = router;

