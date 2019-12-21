var express = require('express');
var router = express.Router();
var productController = require('../controllers/productcontroller');
var controllers = new productController();


// authenticate
const passport = require('passport');

//kiem tra da login hay chua
const {
   ensureAuthenticated
} = require('../config/auth');


router.get('/', function (req, res) {
   controllers.showProduct(req, res);
});
router.get('/upload', function (req, res) {
   controllers.showUpload(req, res);
});

router.get('/detailproduct/:id', function (req, res) {
   controllers.showDetailProduct(req, res);
});

router.get('/topbidding', (req, res) => {
   res.render('topbidding', {
      title: "top bidding"
   });
})

//POST
router.post('/upload', (req, res) => {
   controllers.postUpload(req, res);
})
module.exports = router;