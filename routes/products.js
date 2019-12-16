var express = require('express');
var router = express.Router();
var productController = require('../controllers/productcontroller');
var controllers = new productController();

router.get('/', function (req, res) {
   controllers.showProduct(req, res);
});
router.get('/upload', function (req, res) {
   controllers.showUpload(req, res);
});


//POST
router.post('/upload', (req, res)=>{   
    controllers.postUpload(req, res);
})
module.exports = router;