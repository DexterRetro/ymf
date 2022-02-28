const express = require('express');
const router = express.Router();
const users = require('./Controllers/userController');
const logIn = require('./Controllers/LogInController');
const register = require('./Middlewares/RegisterMiddleWare');
const signup = require('./Middlewares/SignUpPayMiddleWare');
const signupMobile = require('./Middlewares/SignUpPayMobileMiddleWare')
const auth = require('./Middlewares/TokkenAuthenticator')
const pay = require('./Controllers/payController')
const rateLimit= require('express-rate-limit');
const calender = require('./Controllers/Calender')
const blog = require('./Controllers/BlogController')
const ymfIdverify = require('./Middlewares/YMFIDverify')
const limiter = rateLimit({
	windowMs:500, // 100 milli minutes
	max: 1, // Limit each IP to 1 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
//mobile Whatsapp logins and signup routes
router.route('/signup/mobile').post(signupMobile,users.CreateUser);
router.route('logIn/mobile').post(logIn.LogInMobile);

//memebershi routes
router.route('/signup').post(limiter,signup,users.CreateUser);
router.route('/register').post(limiter,register,users.CreateUserFromOldDB)
router.route('/user').put(auth,users.UpdateUser).delete(auth,users.DeleteUser).get(users.GetAllUsers);
router.route('/logIn').post(logIn.logIn).get(auth,users.GetUser);
router.route('/signup/ymfID').post(ymfIdverify,users.SetUpUnverifiedWhatsAppAccount);
router.route('/newusers').get(users.GetUnverifiedUsers).post(users.RegisterNewUser);
router.route('/newusers/:id').delete(users.DeleteUnverifiedUser);
router.route('/oldusers').get(users.GetTransitioningUsers).post(users.RegisterTransUser)

//payment routes
router.route('/payupdate/:id').post(pay.RegPaymentResult);
router.route('/pollpayement').post(pay.CheckSuccess);
router.route('/pay').get(pay.GetPaymentAmount).post(pay.PaySubscription);

//calendar api
router.route('/calendar').get(calender.GetCalender);

//blog
router.route('/blog').get(blog.GetBlogs).post(blog.CreateBlog).delete(blog.DeleteBlog);
router.route('/blog/word').post(blog.UploadDocument);
router.route('/blog/update').post(blog.UpdateBlog)




module.exports = router;
