var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { title: 'Home' });
});

router.get('/detailproduct', function(req, res) {
  res.render('detailproduct', { title: 'Detail product' });
});




module.exports = router;
