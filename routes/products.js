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

router.get('/:id/edit',(req,res)=>{
   controllers.showEditEdittor(req,res);
})
//review
router.get('/reviews/:id', (req, res) => {
   res.render('reviewandrate', {
      title: "reviews"
   });
});

//POST
router.post('/upload', (req, res) => {
   controllers.postUpload(req, res);
});
router.post('/:id/categories', (req, res) => {
   controllers.postSearch(req, res);
})

//cart
router.post('/detailproduct/:id/bid', (req, res) => {
   controllersCart.postBid(req, res);
})

router.post('/detailproduct/:id/addtocart', (req, res) => {
   controllersCart.postAddToCart(req, res);
})

router.post('/detailproduct/:id/watchlist',(req, res)=>{
   controllersCart.postAddWatchlist(req,res);
})

router.post('/:id/edit',(req,res)=>{
   controllers.postEditInforProduct(req,res);
});
router.post('/:id/cacel',(req,res)=>{
   controllers.postCancelInforProduct(req,res);
});
router.post("/detailproduct/:idpro/:namebid/delete",(req,res)=>{
   controllers.postDeleteBidding(req,res);
})
module.exports = router;