const express = require('express');
const router = express.Router();
const users = require('./Controllers/userController');
const logIn = require('./Controllers/LogInController');
const register = require('./Middlewares/RegisterMiddleWare');
const signup = require('./Middlewares/SignUpPayMiddleWare');
const signupMobile = require('./Middlewares/SignUpPayMobileMiddleWare')
const auth = require('./Middlewares/TokkenAuthenticator')
const pay = require('./Controllers/payController')
const calender = require('./Controllers/Calender')
const blog = require('./Controllers/BlogController')
const ymfIdverify = require('./Middlewares/YMFIDverify')
const subPayProcessor = require('./Middlewares/paymentMiddleware');
const CloudStorage= require('./Controllers/FileCloudController')
const Gallery = require('./Controllers/GalleryController')
const adminAuth = require('./Middlewares/adminrightMiddleware');
const finance = require('./Controllers/FinanceController')

//mobile Whatsapp logins and signup routes
router.route('/signup/mobile').post(signupMobile,users.CreateUser);
router.route('logIn/mobile').post(logIn.LogInMobile);

//memebership routes
router.route('/signup').post(signup,users.CreateUser);
router.route('/register').post(register,users.CreateUserFromOldDB)
router.route('/user').put(auth,users.UpdateUser).delete(auth,users.DeleteUser).get(users.GetAllUsers);
router.route('/logIn').post(logIn.logIn).get(auth,users.GetUser);
router.route('/signup/ymfID').post(ymfIdverify,users.SetUpUnverifiedWhatsAppAccount);
router.route('/newusers').get(users.GetUnverifiedUsers).post(adminAuth,users.RegisterNewUser);
router.route('/newusers/:id').delete(adminAuth,users.DeleteUnverifiedUser);
router.route('/oldusers').get(users.GetTransitioningUsers).post(adminAuth,users.RegisterTransUser);


//payment routes
router.route('/payupdate/:id').post(pay.RegPaymentResult);
router.route('/pollpayement').post(pay.CheckSuccess);
router.route('/pay').get(pay.GetPaymentAmount).post(subPayProcessor,pay.PaySubscription);
router.route('/paymentConfirm').post(pay.AddPaymentProof);

//calendar api
router.route('/calendar').get(calender.GetCalender);

//galley api
router.route('/gallery').get(Gallery.GetAllimages);

//blog
router.route('/blog').get(blog.GetBlogs).post(adminAuth,blog.CreateBlog);
router.route('/blog/:id').delete(adminAuth,blog.DeleteBlog);
router.route('/blog/word').post(blog.UploadDocument);
router.route('/blog/update').post(blog.UpdateBlog)
router.route('/blog/unverified').post(adminAuth,blog.VerifyBlog);
router.route('/blog/magazine').get(blog.GetMagazineList).post(adminAuth,blog.UploadMagazine);
router.route('/blog/magazine/:id').delete(adminAuth,blog.DeleteMagazine);

//cloud file storage routes
router.route('/file').get(CloudStorage.GetFile);

//Finances
router.route('/finance/transactions')
  .get(adminAuth,finance.GetTransactions)
  .post(adminAuth,finance.AddTransaction)
router.route('/finance/transactions/:id')
.delete(adminAuth,finance.RemoveTransaction)
.patch(adminAuth,finance.ApproveTransaction);
router.route('/finance/rate')
  .get(finance.GetRate)
  .post(adminAuth,finance.UpdateRate);
router.route('/finance/items')
  .get(finance.GetItems)
  .post(finance.PostItem);
router.route('/finance/item/:id')
  .put(adminAuth,finance.UpdateItem)
  .delete(adminAuth,finance.RemoveItem);


module.exports = router;
