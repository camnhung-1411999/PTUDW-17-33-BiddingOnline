var express = require('express');
var router = express.Router();
const userController = require('../controllers/usercontroller');
const db = require('../models/user');
const controllers = new userController();
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


router.get('/signup', function (req, res) {
  controllers.showSignup(req, res);
});
router.get('/account', function (req, res) {
  controllers.showAccount(req, res);
});


//post
router.post('/signup', (req, res) => {

  var checkInfor = {
    name: req.body.name,
    pass: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
  }
  console.log(checkInfor);

  db.insert(checkInfor);

  res.end("asaaa");
  // res.redirect('/');
});
module.exports = router;
