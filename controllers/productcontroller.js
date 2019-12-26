const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;
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
        var listCategories = [{
            catName: "All Category",
            isActive: false,
            ProID: "all"
        }, {
            catName: "Laptop",
            isActive: false,
            ProID: "laptop"

        }, {
            catName: "Tablet",
            isActive: false,
            ProID: "tablet"

        }, {
            catName: "Mobile",
            isActive: false,
            ProID: "mobile"

        }, ]
        let page = req.query.page || 1;
        console.log("page: " + page);
        if (page < 1) {
            page = 1;
        }

        const offset = (page - 1) * config.paginate.limit;

        if (category === 'laptop') {
            listCategories[1].isActive = true;
            await dbproduct.find({
                selling: true,
                loai: 'laptop'
            }).skip(offset).limit(limit).then(docs => {
                docs.forEach(element => {
                    arrproduct.push(element);
                })
            });
            //count
            total = await dbproduct.find({
                selling: true,
                loai: 'laptop'
            }).count();
        } else if (category === 'mobile') {
            listCategories[3].isActive = true;
            await dbproduct.find({
                selling: true,
                loai: 'mobile'
            }).skip(offset).limit(limit).then(docs => {
                docs.forEach(element => {
                    arrproduct.push(element);
                })
            });

            total = await dbproduct.find({
                selling: true,
                loai: 'mobile'
            }).count();
        } else if (category === 'tablet') {
            listCategories[2].isActive = true;
            await dbproduct.find({
                selling: true,
                loai: 'tablet'
            }).skip(offset).limit(limit).then(docs => {
                docs.forEach(element => {
                    arrproduct.push(element);
                })
            });

            total = await dbproduct.find({
                selling: true,
                loai: 'tablet'
            }).count();
        } else {
            listCategories[0].isActive = true;
            await dbproduct.find({
                selling: true
            }).skip(offset).limit(limit).then(docs => {
                docs.forEach(element => {
                    arrproduct.push(element);
                })
            });
            total = await dbproduct.find({
                selling: true
            }).count();
        }



        var checkuser = false;
        var nameuser;
        if (req.user) {
            checkuser = true;
            nameuser=req.user.name;
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


    //post
    postUpload(req, res) {
        var img = [];
        img.push(req.body.url);
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
        var listCategories = [{
            catName: "All Category",
            isActive: false,
            ProID: "all"
        }, {
            catName: "Laptop",
            isActive: false,
            ProID: "laptop"

        }, {
            catName: "Tablet",
            isActive: false,
            ProID: "tablet"

        }, {
            catName: "Mobile",
            isActive: false,
            ProID: "mobile"

        }, ]

        var checkselect ={
            macdinh: false,
            giatangdan: false,
            giagiamdan: false,
            thoigiangiamdan: false,
            thoigiantangdan:false
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
        } else if (sort === "thoigiantangdan") {
            temp.name = "thoigian";
            temp.value = -1;
        } else if (sort === "thoigiangiamdan") {
            temp.name = "thoigian";
            temp.value = 1;
        }


        var limit = config.paginate.limit;

        let page = req.query.page || 1;
        if (page < 1) {
            page = 1;
        }

        const offset = (page - 1) * config.paginate.limit;

        if (search) {
            if (category === 'laptop') {
                if (temp.name === 'gia') {
                    listCategories[1].isActive = true;
                    await dbproduct.find({
                        $text: {
                            $search: req.body.search
                        },
                        selling: true,
                        loai: 'laptop'

                    }).sort({
                        giahientai: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });
                    total = await dbproduct.find({
                        selling: true,
                        loai: 'laptop'

                    }).count();
                } else {
                    listCategories[1].isActive = true;
                    await dbproduct.find({
                        $text: {
                            $search: req.body.search
                        },
                        selling: true,
                        loai: 'laptop'


                    }).sort({
                        giahientai: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });
                    total = await dbproduct.find({
                        selling: true,
                        loai: 'laptop'
                    }).count();
                }
            } else if (category === 'mobile') {
                if (temp.name === 'gia') {
                    listCategories[3].isActive = true;
                    await dbproduct.find({
                        $text: {
                            $search: req.body.search
                        },
                        selling: true,
                        loai: 'mobile'


                    }).sort({
                        giahientai: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });
                    total = await dbproduct.find({
                        selling: true,
                        loai: 'mobile'

                    }).count();
                } else {
                    listCategories[3].isActive = true;
                    await dbproduct.find({
                        $text: {
                            $search: req.body.search
                        },
                        selling: true,
                        loai: 'mobile'


                    }).sort({
                        giahientai: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });
                    total = await dbproduct.find({
                        selling: true,
                        loai: 'mobile'
                    }).count();
                }

            } else if (category === 'tablet') {
                if (temp.name === 'gia') {
                    listCategories[2].isActive = true;
                    await dbproduct.find({
                        $text: {
                            $search: req.body.search
                        },
                        selling: true,
                        loai: 'tablet'


                    }).sort({
                        giahientai: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });
                    total = await dbproduct.find({
                        selling: true,
                        loai: 'tablet'

                    }).count();
                } else {
                    listCategories[2].isActive = true;
                    await dbproduct.find({
                        $text: {
                            $search: req.body.search
                        },
                        selling: true,
                        loai: 'tablet'


                    }).sort({
                        giahientai: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });
                    total = await dbproduct.find({
                        selling: true,
                        loai: 'tablet'
                    }).count();
                }

            } else {
                if (temp.name === 'gia') {
                    listCategories[0].isActive = true;
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
                        selling: true
                    }).count();
                } else {
                    listCategories[0].isActive = true;
                    await dbproduct.find({
                        $text: {
                            $search: req.body.search
                        },
                        selling: true

                    }).sort({
                        giahientai: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });
                    total = await dbproduct.find({
                        selling: true
                    }).count();
                }
            }
        } else {
            if (category === 'laptop') {
                if (temp.name === "gia") {
                    listCategories[1].isActive = true;
                    await dbproduct.find({
                        selling: true,
                        loai: 'laptop'
                    }).sort({
                        giahientai: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });

                    total = await dbproduct.find({
                        selling: true,
                        loai: 'laptop'
                    }).count();
                } else {
                    listCategories[1].isActive = true;
                    await dbproduct.find({
                        selling: true,
                        loai: 'laptop'

                    }).sort({
                        datetime: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });

                    total = await dbproduct.find({
                        selling: true,
                        loai: 'laptop'

                    }).count();
                }


            } else if (category === 'mobile') {
                if (temp.name === "gia") {
                    listCategories[3].isActive = true;
                    await dbproduct.find({
                        selling: true,
                        loai: 'mobile'
                    }).sort({
                        giahientai: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });

                    total = await dbproduct.find({
                        selling: true,
                        loai: 'mobile'
                    }).count();
                } else {
                    listCategories[3].isActive = true;
                    await dbproduct.find({
                        selling: true,
                        loai: 'mobile'

                    }).sort({
                        datetime: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });

                    total = await dbproduct.find({
                        selling: true,
                        loai: 'mobile'
                    }).count();
                }

            } else if (category === 'tablet') {


                if (temp.name === "gia") {
                    listCategories[2].isActive = true;
                    await dbproduct.find({
                        selling: true,
                        loai: 'tablet'
                    }).sort({
                        giahientai: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });

                    total = await dbproduct.find({
                        selling: true,
                        loai: 'tablet'
                    }).count();
                } else {
                    listCategories[2].isActive = true;
                    await dbproduct.find({
                        selling: true,
                        loai: 'tablet'

                    }).sort({
                        datetime: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });

                    total = await dbproduct.find({
                        selling: true,
                        loai: 'tablet'
                    }).count();
                }

            } else {
                if (temp.name === "gia") {
                    listCategories[0].isActive = true;
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
                    listCategories[0].isActive = true;
                    await dbproduct.find({
                        selling: true,
                    }).sort({
                        datetime: temp.value
                    }).skip(offset).limit(limit).then(docs => {
                        docs.forEach(element => {
                            arrproduct.push(element);
                        })
                    });

                    total = await dbproduct.find({
                        selling: true,
                    }).count();
                }
            }
        }

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

    async showDetailProduct(req, res) {
        var id = req.query.id;
        // var o_id = new ObjectId(id);
        var product = {};
        // console.log("id: "+req.query.id);
        await dbproduct.findOne({
            "_id": ObjectId(id)
        }).then(doc => {
            product = doc;
        });
        var checkuser = false;
        if (req.user) {
            checkuser = true;
            var isSeller = true;
            if (req.user.status != "Seller") {
                isSeller = false;
            }
        }
        res.render('detailproduct', {
            title: 'Detail product',
            product: product,
            checkuser,
            isSeller,
        });
    }
}

module.exports = productController;