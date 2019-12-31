const biddingmodels = require('../models/bidding');
const dbbidding = biddingmodels.getBidding;
var ObjectId = require('mongodb').ObjectId;

const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;

const cartmodels = require('../models/cart');
const dbcart = cartmodels.getCart;
const moment = require('moment');

class CartController {
    async postBid(req, res) {

        var idsanpham = req.params.id;
        var giadau = req.body.giadau;
        var user = req.user.name;

        var bid = {};
        var product = {};
        var checkdaugia = {
            ischecked: false,
            msg: ""
        };

        await dbbidding.findOne({
            idsanpham
        }).then(doc => {
            bid = doc;
        });

        var o_id = new ObjectId(idsanpham);

        await dbproduct.findOne({
            _id: o_id
        }).then(doc => {
            product = doc;
        });

        const now = moment(new Date());
        const time = product.datetime;
        const c = now.diff(time, 'seconds');
        if (product.datetimeproduct * 24 * 3600 - c + product.moretime <= 0) {
            checkdaugia.ischecked = true;
            checkdaugia.msg = "Thời gian đấu giá sản phẩm này đã kết thúc.";
        } else {
            var giatoithieu = 0;
            if (bid === null) {
                giatoithieu = product.giahientai;
            } else {
                giatoithieu = bid.bidding[bid.bidding.length - 1].giadau;
            }

            if (giadau >= giatoithieu) {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var hh = today.getHours();
                var ii = today.getMinutes();
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                if (hh < 10) {
                    hh = '0' + hh;
                }
                if (ii < 10) {
                    ii = '0' + ii;
                }
                var today = yyyy + '/' + mm + '/' + dd + " " + hh + ":" + ii;
                if (bid === null) {
                    var entity = {
                        idsanpham,
                        bidding: [{
                            giadau,
                            user,
                            datebid: today,
                        }],
                        soluot: 1,
                        currentwinner: user,
                        selling: true
                    }
                    biddingmodels.insert(entity);
                } else {
                    bid.bidding.push({
                        giadau,
                        user,
                        datebid: today,
                    });
                    bid.bidding[bid.bidding.length - 1]._id = undefined;
                    bid.soluot += 1;

                    for (var i = bid.bidding.length - 1; i >= 0; i--) {
                        if (i === 0) {
                            bid.currentwinner = bid.bidding[0].user;
                            break;
                        }
                        if (bid.bidding[i].giadau > bid.bidding[i - 1].giadau) {
                            bid.currentwinner = bid.bidding[i].user;
                            break;
                        }
                    }

                    var myquery = {
                        _id: bid._id
                    };
                    var options = {
                        multi: true
                    }
                    await dbbidding.update(myquery, bid, options);
                }
                checkdaugia.ischecked = true;
                checkdaugia.msg = "Đấu giá thành công";

                const now = moment(new Date());
                const time = product.datetime;
                const c = now.diff(time, 'seconds');
                if (product.datetimeproduct * 24 * 3600 - c + product.moretime <= 5 * 60) {
                    product.moretime = product.moretime + 10 * 60;
                }

                var myquery = {
                    _id: product._id
                };
                var options = {
                    multi: true
                }
                var update = {
                    moretime: product.moretime
                }

                await dbproduct.update(myquery, update, options);
            } else {
                checkdaugia.msg = "Mức giá đấu phải cao hơn người đã đấu trước đó";
            }
        }

        var checkuser = false;
        var isSeller = true;
        if (req.user) {
            checkuser = true;
            if (req.user.status != "Seller") {
                isSeller = false;
            }
        }
        var numofbid = 0;
        await dbbidding.findOne({
            idsanpham: id
        }).then(doc => {
            if (doc) {
                console.log(doc);
                numofbid = doc.soluot;
            }
        });
        //detail html
        var strtemp = "";
        var strghichu = product.ghichu;
        var arrdetails = [];
        for (var i = 0; i < strghichu.length; i++) {
            if (strghichu[i] === '.' || strghichu[i] === ',') {
                arrdetails.push({
                    msg: strtemp
                });
                strtemp = "";
            } else {
                strtemp += strghichu[i];
            }
        }
        if (strtemp) {
            arrdetails.push({
                msg: strtemp
            })
        }
        res.render('detailproduct', {
            title: 'Detail product',
            product: product,
            checkuser,
            isSeller,
            numofbid,
            checkdaugia,
            arrdetails
        });

    }

    async postAddToCart(req, res) {
        var idsanpham = req.params.id;
        var o_id = new ObjectId(idsanpham);
        var product = {};
        await dbproduct.findOne({
            _id: o_id
        }).then(doc => {
            product = doc;
        });
        const now = moment(new Date());
        const time = product.datetime;
        const c = now.diff(time, 'seconds');
        if (product.datetimeproduct * 24 * 3600 - c + product.moretime <= 0) {
            checkdaugia.ischecked = true;
            checkdaugia.msg = "Thời gian đấu giá sản phẩm này đã kết thúc.";
        } else {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var hh = today.getHours();
            var ii = today.getMinutes();
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            if (hh < 10) {
                hh = '0' + hh;
            }
            if (ii < 10) {
                ii = '0' + ii;
            }
            var today = yyyy + '/' + mm + '/' + dd + " " + hh + ":" + ii;



            var giadau = product.giamuangay;
            var giaphaitra = giadau;
            var checkdaugia = {
                ischecked: true,
                msg: "Thêm vào giỏ hàng thành công"
            };
            var entity = {
                user: req.user.name,
                idsanpham,
                giadau,
                giaphaitra,
                datebuy: today
            }

            cartmodels.insert(entity);

            //check user
            var checkuser = false;
            var isSeller = true;
            if (req.user) {
                checkuser = true;
                if (req.user.status != "Seller") {
                    isSeller = false;
                }
            }
        }
        var numofbid = 0;
        await dbbidding.findOne({
            idsanpham: id
        }).then(doc => {
            if (doc) {
                console.log(doc);
                numofbid = doc.soluot;
            }
        })
        //detail html
        var strtemp = "";
        var strghichu = product.ghichu;
        var arrdetails = [];
        for (var i = 0; i < strghichu.length; i++) {
            if (strghichu[i] === '.' || strghichu[i] === ',') {
                arrdetails.push({
                    msg: strtemp
                });
                strtemp = "";
            } else {
                strtemp += strghichu[i];
            }
        }
        if (strtemp) {
            arrdetails.push({
                msg: strtemp
            })
        }

        res.render('detailproduct', {
            title: 'Detail product',
            product: product,
            checkuser,
            isSeller,
            numofbid,
            checkdaugia,
            arrdetails
        });
    }
}

module.exports = CartController;