var express = require('express');
var router = express.Router();
const userController = require('../controllers/usercontroller');
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


//post sign up
router.post('/signup', (req, res) => {
  controllers.setPostSignup(req, res);
});
//post sign in
router.post('/signin',(req,res)=>{
  controllers.setPostSignin(req,res);
});
module.exports = router;
