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
        res.render('product', {
            title: 'Product',
            list: arrproduct
        });
    };
    showUpload(req, res) {

        res.render('upload', {
            title: 'Upload product'
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
        var id =req.query.id;
        // var o_id = new ObjectId(id);
        var product = {};
        // console.log("id: "+req.query.id);
        await dbproduct.findOne({"_id": ObjectId(id)}).then(doc=>{
            product = doc;
        });
        console.log(product.image[0]);
        res.render('detailproduct', {
            title: 'Detail product',
            product: product
        });
    }
}

module.exports = productController;