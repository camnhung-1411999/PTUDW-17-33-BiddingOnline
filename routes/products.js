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


router.get('/', ensureAuthenticated, function (req, res) {
   controllers.showProduct(req, res);
});

router.get('/:id/categories', ensureAuthenticated, function (req, res) {
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

router.get('/:id/edit',ensureAuthenticated,(req,res)=>{
   controllers.showEditEdittor(req,res);
})
//review
router.get('/reviews/:id',ensureAuthenticated, (req, res) => {
   res.render('reviewandrate', {
      title: "reviews"
   });
});

//POST
router.post('/upload',ensureAuthenticated, (req, res) => {
   controllers.postUpload(req, res);
});
router.post('/:id/categories',ensureAuthenticated, (req, res) => {
   controllers.postSearch(req, res);
})

//cart
router.post('/detailproduct/:id/bid',ensureAuthenticated, (req, res) => {
   controllersCart.postBid(req, res);
})

router.post('/detailproduct/:id/addtocart',ensureAuthenticated, (req, res) => {
   controllersCart.postAddToCart(req, res);
})

router.post('/detailproduct/:id/watchlist',ensureAuthenticated,(req, res)=>{
   controllersCart.postAddWatchlist(req,res);
})

router.post('/:id/edit',ensureAuthenticated,(req,res)=>{
   controllers.postEditInforProduct(req,res);
});
router.post('/:id/cacel',ensureAuthenticated,(req,res)=>{
   controllers.postCancelInforProduct(req,res);
});
router.post("/detailproduct/:idpro/:namebid/delete",ensureAuthenticated,(req,res)=>{
   controllers.postDeleteBidding(req,res);
})
module.exports = router;