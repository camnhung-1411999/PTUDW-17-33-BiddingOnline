var express = require('express');
var router = express.Router();
const userController = require('../controllers/usercontroller');
const controllers = new userController();

// authenticate
const passport = require('passport');

//kiem tra da login hay chua
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
})

router.get('/account', function (req, res) {
  controllers.showAccount(req, res);
});


//post sign up
router.post('/signup', (req, res) => {
  controllers.setPostSignup(req, res);
});
//post sign in
router.post('/signin', (req, res, next) => {
  // controllers.setPostSignin(req, res);
  console.log(req.body.username +"-"+ req.body.password);
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signup_' + req.body.username
  })(req, res, next);
});
module.exports = router;