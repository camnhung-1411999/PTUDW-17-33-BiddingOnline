var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res) {
  var checkuser = false;
  if (req.user) {
    checkuser = true;
    var isSeller=true;
    if(req.user.status!="Seller"){
      isSeller=false;
    }
  }  
  res.render('home', {
    title: 'Home',
    checkuser,
    isSeller,
  });
});





module.exports = router;
