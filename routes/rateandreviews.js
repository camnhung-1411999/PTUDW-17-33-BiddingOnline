var express = require('express');
var router = express.Router();
const reviewscontroller = require('../controllers/reviewscontroller');
const controllers = new reviewscontroller();


router.get('/:id', (req, res)=>{
   
    controllers.showReviewsAndRate(req, res);
})
module.exports = router;
