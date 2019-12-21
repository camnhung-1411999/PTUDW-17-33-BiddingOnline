const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;
const moment = require('moment');
var ObjectId = require('mongodb').ObjectId;

class productController {
    async showProduct(req, res) {

        var arrproduct = [];

        await dbproduct.find({}).then((docs) => {
            docs.forEach(element => {
                arrproduct.push(element);
            })
        });

        var checkuser = false;
        if (req.user) {
            checkuser = true;
            var isSeller = true;
            if (req.user.status != "Seller") {
                isSeller = false;
            }
        }
        res.render('product', {
            title: 'Product',
            list: arrproduct,
            checkuser,
            isSeller,
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
            giahientai: req.body.beginprice,
            giatoithieu: req.body.miniprice,
            giamuangay: req.body.buynow,
            buocdaugia: req.body.stepprice,
            loai: req.body.selname,
            datetime: req.body.dob,
            datetimeproduct: temp * req.body.timeproduct,
            ghichu: req.body.ghichu
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
        await dbproduct.findOne({ "_id": ObjectId(id) }).then(doc => {
            product = doc;
        });
        console.log(product.image[0]);
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