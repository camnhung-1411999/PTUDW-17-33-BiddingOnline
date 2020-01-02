const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;

const biddingmodels = require('../models/bidding');
const dbbidding = biddingmodels.getBidding;

const reviewsmodels = require('../models/review');
const dbreviews = reviewsmodels.getReviews;

const categoriesmodels = require('../models/category');
const dbcategory = categoriesmodels.getCategory;

const moment = require('moment');
var ObjectId = require('mongodb').ObjectId;
const config = require('../config/default.json');

class productController {

    //:id/categories
    async showProduct(req, res) {
        var category = req.params.id;
        var limit = config.paginate.limit;
        var arrproduct = [];
        var total = 0;

        var listCategories = [];
        await dbcategory.find({}).sort({
            idcat: 1
        }).then(docs => {
            docs.forEach(element => {
                listCategories.push(element);
            })
        })
        let page = req.query.page || 1;
        console.log("page: " + page);
        if (page < 1) {
            page = 1;
        }

        const offset = (page - 1) * config.paginate.limit;

        for (var i = 0; i < listCategories.length; i++) {
            if (listCategories[i].idcat === category) {
                listCategories[i].isActive = true;
                if (category === 'all') {

                    await dbproduct.find({
                        selling: true,
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });
                    //count
                    total = await dbproduct.find({
                        selling: true,
                    }).count();
                } else {
                    await dbproduct.find({
                        selling: true,
                        loai: listCategories[i].idcat
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });
                    //count
                    total = await dbproduct.find({
                        selling: true,
                        loai: listCategories[i].idcat
                    }).count();
                }
            } else {
                listCategories[i].isActive = false;
            }
        }


        var checkuser = false;
        var nameuser;
        if (req.user) {
            checkuser = true;
            nameuser = req.user.name;
            var isSeller = true;
            if (req.user.status != "Seller") {
                isSeller = false;
            }
        }


        const now = moment(new Date());

        for (var i = 0; i < arrproduct.length; i++) {

            const time = arrproduct[i].datetime;
            const c = now.diff(time, 'seconds');
            if (c < 600) {
                arrproduct[i].new = true;
            }

            if ((arrproduct[i].datetimeproduct * 24 * 3600 + arrproduct[i].moretime) > c) {
                var temp = arrproduct[i].datetimeproduct * 24 * 3600 + arrproduct[i].moretime - c;
                arrproduct[i].datetimeproduct = temp;
            } else {
                const entity = {
                    selling: false
                };

                const myquery = {
                    _id: arrproduct[i]._id
                };
                var options = {
                    multi: true
                };

                await dbproduct.update(myquery, entity, options);
                arrproduct[i].selling = false;

            }
        }



        let nPages = Math.floor(total / limit);

        if (total % limit > 0) nPages++;
        const page_numbers = [];
        for (i = 1; i <= nPages; i++) {
            page_numbers.push({
                value: i,
                isCurrentPage: i === +page
            })
        }

        for (var i = 0; i < arrproduct.length; i++) {
            arrproduct[i].soluot = 0;
            await dbbidding.findOne({
                idsanpham: arrproduct[i]._id.toString()
            }).then(doc => {
                if (doc) {
                    arrproduct[i].soluot = doc.soluot;
                }
            });
        }

        res.render('product', {
            title: 'Product',
            list: arrproduct,
            listCategories,
            checkuser,
            isSeller,
            page_numbers,
            prev_value: +page - 1,
            next_value: +page + 1,

        });
    };
    showUpload(req, res) {
        var checkuser = false;
        if (req.user) {
            checkuser = true;
            var isSeller = true;
            if (req.user.status != "Seller") {
                isSeller = false;
            }
        }
        res.render('upload', {
            title: 'Upload product',
            checkuser,
            isSeller,
        });
    }

    async showTopBidding(req, res) {
        var giacaonhat = [];
        var ragianhieunhat = [];
        var thoigiansaphet = [];
        // thoi gian sap het
        await dbproduct.find({}).sort({
            datetimeproduct: -1
        }).limit(5).then((docs) => {
            docs.forEach(element => {
                thoigiansaphet.push(element);
            })
        })
        //nhieu danh gia nhat
        await dbproduct.find({}).limit(5).then((docs) => {
            docs.forEach(element => {
                ragianhieunhat.push(element);
            })
        })

        //gia cao nhat
        await dbproduct.find({}).sort({
            giahientai: -1
        }).limit(5).then(docs => {
            docs.forEach(element => {
                giacaonhat.push(element);
            })
        })
        res.render('topbidding', {
            title: 'Top Bidding',
            mostprices: giacaonhat,
            mostbids: ragianhieunhat,
            neartimeout: thoigiansaphet
        });
    }

    async showDetailProduct(req, res) {
        var id = req.params.id;
        var product = {};
        await dbproduct.findOne({
            "_id": ObjectId(id)
        }).then(doc => {
            product = doc;
        });
        var checkuser = false;
        var isSeller = true;
        if (req.user) {
            checkuser = true;
            if (req.user.status != "Seller") {
                isSeller = false;
            }
        }

        //comment
        var reviews = [];
        await dbreviews.find({
            user: product.user
        }).then(docs => {
            docs.forEach(element => {
                reviews.push(element);
            });
        });

        var avgrate = 0;
        for (var i = 0; i < reviews.length; i++) {
            avgrate = avgrate + reviews[i].rate;

        }

        avgrate = avgrate / reviews.length;
        var x = parseFloat(avgrate);
        avgrate = Math.round(x * 100) / 100;


        //number of bid
        var numofbid = 0;
        var biddingofproduct = {};
        await dbbidding.findOne({
            idsanpham: id
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
        const now = moment(new Date());

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
        if (!avgrate) {
            avgrate = 0;
        }

        res.render('detailproduct', {
            title: 'Detail product',
            product: product,
            checkuser,
            isSeller,
            rate: avgrate,
            reviews,
            numofbid,
            numreviews: reviews.length,
            arrdetails,
            currentwinner,
            nearproducts
        });
    }

    //post
    postUpload(req, res) {
        var img = [];
        img.push(req.body.url);
        img.push(req.body.url1);
        img.push(req.body.url2);
        var temp = 0;
        var sldate = req.body.selectdate;
        if (sldate === "ngay") {
            temp = 1;
        } else if (sldate === "tuan") {
            temp = 7;
        } else {
            temp = 30;
        }
        var entity = {
            image: img,
            ten: req.body.nameproduct,
            giahientai: +req.body.beginprice,
            giatoithieu: +req.body.miniprice,
            giamuangay: +req.body.buynow,
            buocdaugia: +req.body.stepprice,
            loai: req.body.selname,
            datetime: req.body.dob,
            datetimeproduct: +temp * req.body.timeproduct,
            moretime: 0,
            ghichu: req.body.ghichu,
            selling: true,
            user: req.user.name
        }



        productmodels.insert(entity);
        res.render('upload', {
            title: 'Upload product'
        });
    }

    async postSearch(req, res) {
        var category = req.params.id;

        var sort = req.body.select;
        var arrproduct = [];
        var search = req.body.search;
        var total = 0;

        var listCategories = [];
        await dbcategory.find({}).sort({
            idcat: 1
        }).then(docs => {
            docs.forEach(element => {
                listCategories.push(element);
            })
        })

        var checkselect = {
            macdinh: false,
            giatangdan: false,
            giagiamdan: false,
            thoigiangiamdan: false,
            thoigiantangdan: false
        }

        var temp = {
            value: 1,
            name: "thoigiangiamdan"
        };

        if (sort === "giagiamdan") {
            temp.name = "gia";
            temp.value = -1;
        } else if (sort === "giatangdan") {
            temp.name = "gia";
            temp.value = 1;
        }


        var limit = config.paginate.limit;

        let page = req.query.page || 1;
        if (page < 1) {
            page = 1;
        }

        const offset = (page - 1) * config.paginate.limit;

        if (search) {

            for (var i = 0; i < listCategories.length; i++) {
                if (listCategories[i].idcat === category) {
                    if (temp.name === 'gia') {
                        if (category === 'all') {
                            listCategories[i].isActive = true;
                            await dbproduct.find({
                                $text: {
                                    $search: req.body.search
                                },
                                selling: true,
                            }).sort({
                                giahientai: temp.value
                            }).skip(offset).limit(limit).then(docs => {
                                docs.forEach(element => {
                                    arrproduct.push(element);
                                })
                            });
                            total = await dbproduct.find({
                                selling: true,
                            }).count();
                        } else {
                            listCategories[i].isActive = true;
                            await dbproduct.find({
                                $text: {
                                    $search: req.body.search
                                },
                                selling: true,
                                loai: listCategories[i].idcat
                            }).sort({
                                giahientai: temp.value
                            }).skip(offset).limit(limit).then(docs => {
                                docs.forEach(element => {
                                    arrproduct.push(element);
                                })
                            });
                            total = await dbproduct.find({
                                selling: true,
                                loai: listCategories[i].idcat

                            }).count();
                        }
                    } else {
                        listCategories[i].isActive = true;
                        if (listCategories[i].idcat === 'all') {
                            await dbproduct.find({
                                $text: {
                                    $search: req.body.search
                                },
                                selling: true,

                            }).sort({
                                giahientai: temp.value
                            }).skip(offset).limit(limit).then(docs => {
                                docs.forEach(element => {
                                    arrproduct.push(element);
                                })
                            });
                            total = await dbproduct.find({
                                selling: true,
                            }).count();
                        } else {
                            await dbproduct.find({
                                $text: {
                                    $search: req.body.search
                                },
                                selling: true,
                                loai: listCategories[i].idcat

                            }).sort({
                                giahientai: temp.value
                            }).skip(offset).limit(limit).then(docs => {
                                docs.forEach(element => {
                                    arrproduct.push(element);
                                })
                            });
                            total = await dbproduct.find({
                                selling: true,
                                loai: listCategories[i].idcat
                            }).count();
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < listCategories.length; i++) {
                if (listCategories[i].idcat === category) {
                    if (temp.name === 'gia') {
                        if (category === 'all') {
                            listCategories[i].isActive = true;
                            await dbproduct.find({
                                selling: true,
                            }).sort({
                                giahientai: temp.value
                            }).skip(offset).limit(limit).then(docs => {
                                docs.forEach(element => {
                                    arrproduct.push(element);
                                })
                            });
                            total = await dbproduct.find({
                                selling: true,
                            }).count();
                        } else {
                            listCategories[i].isActive = true;
                            await dbproduct.find({
                                selling: true,
                                loai: listCategories[i].idcat
                            }).sort({
                                giahientai: temp.value
                            }).skip(offset).limit(limit).then(docs => {
                                docs.forEach(element => {
                                    arrproduct.push(element);
                                })
                            });
                            total = await dbproduct.find({
                                selling: true,
                                loai: listCategories[i].idcat

                            }).count();
                        }
                    } else {
                        listCategories[i].isActive = true;
                        if (listCategories[i].idcat === 'all') {
                            await dbproduct.find({
                                selling: true,

                            }).sort({
                                giahientai: temp.value
                            }).skip(offset).limit(limit).then(docs => {
                                docs.forEach(element => {
                                    arrproduct.push(element);
                                })
                            });
                            total = await dbproduct.find({
                                selling: true,
                            }).count();
                        } else {
                            await dbproduct.find({
                                selling: true,
                                loai: listCategories[i].idcat

                            }).sort({
                                giahientai: temp.value
                            }).skip(offset).limit(limit).then(docs => {
                                docs.forEach(element => {
                                    arrproduct.push(element);
                                })
                            });
                            total = await dbproduct.find({
                                selling: true,
                                loai: categoriesmodels[i].idcat
                            }).count();
                        }
                    }
                }
            }
        };

        var checkuser = false;
        if (req.user) {
            checkuser = true;
            var isSeller = true;
            if (req.user.status != "Seller") {
                isSeller = false;
            }
        }

        const now = moment(new Date());
        for (var i = 0; i < arrproduct.length; i++) {

            const time = arrproduct[i].datetime;
            const c = now.diff(time, 'seconds');
            if (arrproduct[i].datetimeproduct * 24 * 3600 > c) {
                var temp = arrproduct[i].datetimeproduct * 24 * 3600 - c;
                arrproduct[i].datetimeproduct = temp;
            } else {

                const entity = {
                    selling: false
                };

                const myquery = {
                    _id: arrproduct[i]._id
                };
                var options = {
                    multi: true
                };

                await dbproduct.update(myquery, entity, options);
                arrproduct[i].selling = false;

            }
        }



        let nPages = Math.floor(total / limit);

        if (total % limit > 0) nPages++;
        const page_numbers = [];
        for (i = 1; i <= nPages; i++) {
            page_numbers.push({
                value: i,
                isCurrentPage: i === +page
            })
        }

        if (sort === "thoigiantangdan") {
            var arrtemp = [];

            await dbproduct.find({
                selling: true,
            }).then(docs => {
                docs.forEach(element => {
                    arrtemp.push(element);
                });
            });

            //convert time to ss
            var n = arrtemp.length;
            for (var i = 0; i < n; i++) {

                const time = arrtemp[i].datetime;
                const c = now.diff(time, 'seconds');
                if (arrtemp[i].datetimeproduct * 24 * 3600 > c) {
                    var temp = arrtemp[i].datetimeproduct * 24 * 3600 - c;
                    arrtemp[i].datetimeproduct = temp;
                } else {

                    const entity = {
                        selling: false
                    };

                    const myquery = {
                        _id: arrtemp[i]._id
                    };
                    var options = {
                        multi: true
                    };

                    await dbproduct.update(myquery, entity, options);
                    arrtemp[i].selling = false;

                }
            }

            //sort 
            for (var i = 0; i < n; i++) {
                for (var j = i + 1; j < n; j++) {
                    if (arrtemp[i].datetimeproduct > arrtemp[j].datetimeproduct) {
                        var temp = arrtemp[i].datetimeproduct;
                        arrtemp[i].datetimeproduct = arrtemp[j].datetimeproduct;
                        arrtemp[j].datetimeproduct = temp;
                    }
                }
            }
            for (var i = 0; i < limit; i++) {
                arrproduct[i] = arrtemp[i];
            }

            listCategories[0].isActive = true;
            // listCategories[1].isActive = false;
            // listCategories[2].isActive = false;
            // listCategories[3].isActive = false;

        } else if (sort === "thoigiangiamdan") {
            var arrtemp = [];

            await dbproduct.find({
                selling: true,
            }).then(docs => {
                docs.forEach(element => {
                    arrtemp.push(element);
                });
            });
            //convert time to ss
            var n = arrtemp.length;
            for (var i = 0; i < n; i++) {

                const time = arrtemp[i].datetime;
                const c = now.diff(time, 'seconds');
                if (arrtemp[i].datetimeproduct * 24 * 3600 > c) {
                    var temp = arrtemp[i].datetimeproduct * 24 * 3600 - c;
                    arrtemp[i].datetimeproduct = temp;
                } else {

                    const entity = {
                        selling: false
                    };

                    const myquery = {
                        _id: arrtemp[i]._id
                    };
                    var options = {
                        multi: true
                    };

                    await dbproduct.update(myquery, entity, options);
                    arrtemp[i].selling = false;

                }
            }
            //sort 
            for (var i = 0; i < n; i++) {
                for (var j = i + 1; j < n; j++) {
                    if (arrtemp[i].datetimeproduct < arrtemp[j].datetimeproduct) {
                        var temp = arrtemp[i].datetimeproduct;
                        arrtemp[i].datetimeproduct = arrtemp[j].datetimeproduct;
                        arrtemp[j].datetimeproduct = temp;
                    }
                }
            }
            for (var i = 0; i < limit; i++) {
                arrproduct[i] = arrtemp[i];
            }

            listCategories[0].isActive = true;
            // listCategories[1].isActive = false;
            // listCategories[2].isActive = false;
            // listCategories[3].isActive = false;
        }


        for (var i = 0; i < arrproduct.length; i++) {
            arrproduct[i].soluot = 0;
            await dbbidding.findOne({
                idsanpham: arrproduct[i]._id.toString()
            }).then(doc => {
                if (doc) {
                    arrproduct[i].soluot = doc.soluot;
                }
            });
        }

        var thongbao = req.body.search;
        res.render('product', {
            title: 'Product',
            list: arrproduct,
            listCategories,
            checkuser,
            isSeller,
            page_numbers,
            prev_value: +page - 1,
            next_value: +page + 1,
            thongbao,
        });
    }

}

module.exports = productController;