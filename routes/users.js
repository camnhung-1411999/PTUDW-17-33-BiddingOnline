var express = require('express');
var router = express.Router();
const userController = require('../controllers/usercontroller');
const controllers = new userController();

// authenticate
const passport = require('passport');
const {
  ensureAuthenticated
} = require('../config/auth');


router.get('/signup', function (req, res) {
  controllers.showSignup(req, res);
});

router.get('/signup_:username', (req, res) => {
  var username = req.params.name;
  res.render('signup_in', {
    title: 'Đăng nhập',
    checksignin: true
  });
});

router.get('/favorites', (req, res) => {
  controllers.showFavorites(req, res);
})

router.get('/myauctions', (req, res) => {
  controllers.showMyAutions(req, res);
})

//post sign up
router.post('/signup', (req, res) => {
  controllers.setPostSignup(req, res);
});
//post sign in
router.post('/signin', (req, res, next) => {
  if (req.body.username === "admin") {
    passport.authenticate('local', {
      successRedirect: '/admin',
      failureRedirect: '/users/signup_' + req.body.username
    })(req, res, next);
  } else {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/signup_' + req.body.username
    })(req, res, next);
  }
});



router.get('/account', function (req, res) {
  controllers.showAccount(req, res);
});
router.get('/changepassword', function (req, res) {
  controllers.showChangePassword(req, res);
});

router.get('/mycart', (req, res) => {
  controllers.showCart(req, res);
});

router.get('/mybid', (req, res) => {
  controllers.showBid(req, res);
})

router.get('/history',(req, res)=>{
    controllers.showHistory(req, res);
})
router.get('/manageuser', (req, res) => {
  controllers.showManageUser(req, res);
});
router.get('/manageproduct/:id',(req, res) => {
  controllers.showProductCate(req,res);
})
router.get('/managecategory', (req, res) => {
  controllers.showManageCategory(req, res);
})
router.get('/manageuser/listbid', (req, res) => {
  controllers.showManageUser(req, res);
})

router.get('/manageuser/listsell', (req, res) => {
  controllers.showListSell(req, res);
})

router.get('/manageuser/register', (req, res) => {
  controllers.showRegister(req, res);
})
//post
router.post('/mycart/delete', (req, res) => {
  controllers.postDeleteMyCart(req, res);
})
router.post('/mycart/buy/:id', (req, res) => {
  controllers.postBuyProductNow(req, res);
})


router.post('/account', function (req, res) {
  controllers.setPostAccount(req, res);
});
router.post('/changepassword', function (req, res) {
  controllers.setPostPassword(req, res);
})
router.post('/registerseller', (req, res) => {
  controllers.setPostRegisterSeller(req, res);
});
router.post('/confirm', (req, res) => {
  controllers.setPostRegistConfirm(req, res);
})
router.post('/delete', (req, res) => {
  controllers.setPostRegistDelete(req, res);
});
router.post('/deleteproduct', (req, res) => {
  controllers.setPostDeleteProduct(req, res);
})
router.post('/deletecate', (req, res) => {
  console.log(req.params.id);
  controllers.setPostDeleteCate(req, res);
})
router.post('/insertcategory', (req, res) => {
  controllers.setPostInsertCate(req, res);
})
router.post('/renamecate', (req, res) => {
  controllers.setPostRenameCate(req, res);
})
router.post('/cancel', (req, res) => {
  controllers.setPostCancelSeller(req, res);
})
module.exports = router;