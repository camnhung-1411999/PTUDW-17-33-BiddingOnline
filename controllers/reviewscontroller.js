const reviewsmodels = require('../models/review');
const dbreview = reviewsmodels.getReviews;
class productController {
    async showReviewsAndRate(req, res) {

        var username = req.params.id;
        var arrreviews = [];
        var ratetb = 0;
        var dem = 0;
        await dbreview.find({
            user: username
        }).then(docs => {
            docs.forEach(element => {
                arrreviews.push(element);
                ratetb += element.rate;
                dem+=1;
            })
        });

        ratetb = ratetb / dem
        var x = parseFloat(ratetb);
        ratetb = Math.round(x * 100) / 100;


        if(!ratetb){
            ratetb = 0; 
        }
        res.render('reviewandrate', {
            title: 'reviews',
            reviews: arrreviews,
            username,
            ratetb
        })
    }

}

module.exports = productController;