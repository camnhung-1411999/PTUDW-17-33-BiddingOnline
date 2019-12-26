const biddingmodels = require('../models/bidding');
const dbbidding = biddingmodels.getBidding;

const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;

class CartController {
    postBid(req, res) {
        var idsanpham = req.params.id;
        var giadau = req.body.giadau;
        var user = req.user.name;

        var entity = {
            idsanpham,
            giadau,
            user
        }
        console.log(entity);
        biddingmodels.insert(entity);
        res.redirect('../../../products');
    }
}

module.exports = CartController;