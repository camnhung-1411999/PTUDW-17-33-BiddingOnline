const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;
const moment = require('moment');
var ObjectId = require('mongodb').ObjectId;
const config = require('../config/default.json');

class productController {

    async showProduct(req, res) {

        var category = req.query.id;
        var limit = config.paginate.limit;

        var laptop = false,
            tablet = false,
            mobile = false,
            allcategory = false;
        if (category === 'latop') {
            laptop = true;
        } else if (category === 'mobile') {
            mobile = true;
        } else if (category === 'tablet') {
            tablet = true;
        } else {
            allcategory = true;
        }
        var arrproduct = [];

        // await dbproduct.find({
        //     selling: true
        // }).then((docs) => {
        //     docs.forEach(element => {
        //         arrproduct.push(element);
        //     })
        // });


        var total = await dbproduct.find({
            selling: true
        }).count();

        var checkuser = false;
        if (req.user) {
            checkuser = true;
            var isSeller = true;
            if (req.user.status != "Seller") {
                isSeller = false;
            }
        }

        const page = req.query.page || 1;
        console.log("page: " + page);
        if (page < 1) page = 1;
        const offset = (page - 1) * config.paginate.limit;
        await dbproduct.find({
            selling: true
        }).skip(offset).limit(limit).then(docs => {
            docs.forEach(element => {
                arrproduct.push(element);
            })
        })

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

        // console.log(timeout);
        res.render('product', {
            title: 'Product',
            list: arrproduct,
            checkuser,
            isSeller,
            mobile,
            laptop,
            tablet,
            allcategory,
            page_numbers,
            prev_value: +page - 1,
            next_value: +page + 1,
            //page_numbers,

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
            user: req.user.ten
        }



        productmodels.insert(entity);
        res.render('upload', {
            title: 'Upload product'
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