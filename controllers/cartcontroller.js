const biddingmodels = require('../models/bidding');
const dbbidding = biddingmodels.getBidding;
var ObjectId = require('mongodb').ObjectId;

const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;

const cartmodels = require('../models/cart');
const dbcart = cartmodels.getCart;

const watchlistmodels = require('../models/watchlist');
const dbwatchlist = watchlistmodels.getWatchlist;
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
        var numofbid = 0;
        var biddingofproduct = {};
        await dbbidding.findOne({
            idsanpham
        }).then(doc => {
            if (doc) {
                numofbid = doc.soluot;
                biddingofproduct = doc;
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
        //mask bid winner
        var currentwinner = "";
        if (biddingofproduct.currentwinner) {
            currentwinner = biddingofproduct.currentwinner.toString();

        } else {
            currentwinner = "Nobody";
        }
        var nearproducts = [];
        await dbproduct.find({
            selling: true,
            loai: product.loai
        }).limit(5).then(docs => {
            docs.forEach(element => {
                nearproducts.push(element);
            })
        });

        //bidding
        for (var i = 0; i < nearproducts.length; i++) {
            nearproducts[i].soluot = 0;
            await dbbidding.findOne({
                idsanpham: nearproducts[i]._id.toString()
            }).then(doc => {
                if (doc) {
                    nearproducts[i].soluot = doc.soluot;
                }
            });
        }

        //countimer

        for (var i = 0; i < nearproducts.length; i++) {

            const time = nearproducts[i].datetime;
            const c = now.diff(time, 'seconds');
            if (c < 600) {
                nearproducts[i].new = true;
            }

            if ((nearproducts[i].datetimeproduct * 24 * 3600 + nearproducts[i].moretime) > c) {
                var temp = nearproducts[i].datetimeproduct * 24 * 3600 + nearproducts[i].moretime - c;
                nearproducts[i].datetimeproduct = temp;
            } else {
                const entity = {
                    selling: false
                };

                const myquery = {
                    _id: nearproducts[i]._id
                };
                var options = {
                    multi: true
                };

                await dbproduct.update(myquery, entity, options);
                nearproducts[i].selling = false;

            }
        }
        res.render('detailproduct', {
            title: 'Detail product',
            product: product,
            checkuser,
            isSeller,
            numofbid,
            checkdaugia,
            arrdetails,
            nearproducts
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
        var biddingofproduct = [];
        await dbbidding.findOne({
            idsanpham
        }).then(doc => {
            if (doc) {
                console.log(doc);
                numofbid = doc.soluot;
                biddingofproduct = doc;
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
        //mask bid winner
        var currentwinner = "";
        if (biddingofproduct.currentwinner) {
            currentwinner = biddingofproduct.currentwinner.toString();

        } else {
            currentwinner = "Nobody";
        }
        var nearproducts = [];
        await dbproduct.find({
            selling: true,
            loai: product.loai
        }).limit(5).then(docs => {
            docs.forEach(element => {
                nearproducts.push(element);
            })
        });

        //bidding
        for (var i = 0; i < nearproducts.length; i++) {
            nearproducts[i].soluot = 0;
            await dbbidding.findOne({
                idsanpham: nearproducts[i]._id.toString()
            }).then(doc => {
                if (doc) {
                    nearproducts[i].soluot = doc.soluot;
                }
            });
        }

        //countimer

        for (var i = 0; i < nearproducts.length; i++) {

            const time = nearproducts[i].datetime;
            const c = now.diff(time, 'seconds');
            if (c < 600) {
                nearproducts[i].new = true;
            }

            if ((nearproducts[i].datetimeproduct * 24 * 3600 + nearproducts[i].moretime) > c) {
                var temp = nearproducts[i].datetimeproduct * 24 * 3600 + nearproducts[i].moretime - c;
                nearproducts[i].datetimeproduct = temp;
            } else {
                const entity = {
                    selling: false
                };

                const myquery = {
                    _id: nearproducts[i]._id
                };
                var options = {
                    multi: true
                };

                await dbproduct.update(myquery, entity, options);
                nearproducts[i].selling = false;

            }
        }

        res.render('detailproduct', {
            title: 'Detail product',
            product: product,
            checkuser,
            isSeller,
            numofbid,
            checkdaugia,
            arrdetails,
            nearproducts
        });
    }

    async postAddWatchlist(req, res) {
        var idsanpham = req.params.id;
        var entity = {
            idsanpham,
            user: req.user.name
        }
        var checkwathlist = {};
        await dbwatchlist.findOne({
            idsanpham
        }).then(doc => {
            checkwathlist = doc;
        })
        if (checkwathlist) {
            checkdaugia.msg = "Product is exists in your watchlist!";
        } else {
            watchlistmodels.insert(entity);
        }

        res.redirect('/products/detailproduct/' + req.params.id);
    }
}

module.exports = CartController;