const express = require('express');
const router = express.Router();
const users = require('./Controllers/userController');
const logIn = require('./Controllers/LogInController');
const signup = require('./Middlewares/SignUpPayMiddleWare');
const auth = require('./Middlewares/TokkenAuthenticator')
const pay = require('./Controllers/payController')
const rateLimit= require('express-rate-limit');
const calender = require('./Controllers/Calender')
const blog = require('./Controllers/BlogController')
const limiter = rateLimit({
	windowMs:500, // 100 milli minutes
	max: 1, // Limit each IP to 1 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

//creates payment and creates user In DB and Waits for verification of payment
router.route('/signup').post(limiter,signup,users.CreateUser);
router.route('/user').put(auth,users.UpdateUser).delete(auth,users.DeleteUser).get(auth,users.GetUser);
router.route('/logIn').post(logIn.logIn);
router.route('/payupdate/:id').post(pay.RegPaymentResult);
router.route('/pollpayement').post(pay.CheckSuccess);
router.route('/calendar').get(calender.GetCalender);
router.route('/pay').get(pay.GetPaymentAmount).post(pay.PaySubscription);
router.route('/blog').get(blog.GetBlogs).patch(blog.UpdateBlog).post(blog.CreateBlog).delete(blog.DeleteBlog);




module.exports = router;
