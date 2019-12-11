var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res) {
  res.render('home', { title: 'Home' });
});

router.get('/account', function(req, res) {
  res.render('account', { title: 'Account' });
});

router.get('/detailproduct', function(req, res) {
  res.render('detailproduct', { title: 'Detail product' });
});

router.get('/product', function(req, res) {
  res.render('product', { title: 'Product' });
});

router.get('/signup', function(req, res) {
  res.render('signup_in', { title: 'Sign in/ Sign up' });
});
router.get('/upload', function(req, res) {
  res.render('upload', { title: 'Upload product' });
});

module.exports = router;
