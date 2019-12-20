var express = require('express');
var router = express.Router();
var productController = require('../controllers/productcontroller');
var controllers = new productController();

router.get('/', function (req, res) {
   controllers.showProduct(req, res);
});
router.get('/upload', function (req, res) {
   console.log("day la:" + req.user);
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