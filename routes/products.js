var express = require('express');
var router = express.Router();
var productController = require('../controllers/productcontroller');
var controllers = new productController();

var cartcontroller = require('../controllers/cartcontroller');
var controllersCart = new cartcontroller();

// authenticate
const passport = require('passport');

//kiem tra da login hay chua
const {
   ensureAuthenticated
} = require('../config/auth');


router.get('/', function (req, res) {
   controllers.showProduct(req, res);
});

router.get('/:id/categories', function (req, res) {
   controllers.showProduct(req, res);
});


router.get('/upload', ensureAuthenticated, function (req, res) {
   controllers.showUpload(req, res);
});

router.get('/detailproduct/:id', ensureAuthenticated, function (req, res) {
   controllers.showDetailProduct(req, res);
});

router.get('/topbidding', (req, res) => {
   controllers.showTopBidding(req, res);
});


//POST
router.post('/upload', (req, res) => {
   controllers.postUpload(req, res);
});
router.post('/:id/categories',(req,res)=>{
   controllers.postSearch(req, res);
})

//cart
router.post('/detailproduct/:id/bid',(req, res)=>{
   controllersCart.postBid(req, res);
})



module.exports = router;


