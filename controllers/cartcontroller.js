const biddingmodels = require('../models/bidding');
const dbbidding = biddingmodels.getBidding;

const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;

class CartController {
    async postBid(req, res) {
        var idsanpham = req.params.id;
        var giadau = req.body.giadau;
        var user = req.user.name;

        var bid = {};
        await dbbidding.findOne({
            idsanpham
        }).then(doc => {
            bid = doc;
        });
        if (bid === null) {
            console.log("trống rỗng");
            var entity = {
                idsanpham,
                bidding: [{
                    giadau,
                    user
                }]
            }
            console.log(entity);
            biddingmodels.insert(entity);
        } else {
            console.log("Tồn tại r");

            bid.bidding.push({
                giadau,
                user
            });
            bid.bidding[1]._id =undefined;

            console.log(bid);


            var myquery = {_id: bid._id};
            var options = {
                multi: true
            }

            await dbbidding.update(myquery, bid, options);
        }



        res.redirect('../../../products');
    }
}

module.exports = CartController;