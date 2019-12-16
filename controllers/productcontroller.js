const productmodels = require('../models/products');
const db = productmodels.getProduct;
const moment = require('moment');

class productController {
    showProduct(req, res) {
        res.render('product', {
            title: 'Product'
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
        var entity = {
            image: img,
            ten: req.body.nameproduct,
            giahientai: req.body.beginprice,
            giatoithieu: req.body.miniprice,
            giamuangay: req.body.buynow,
            buocdaugia: req.body.stepprice,
            loai: req.body.selname
        }

        const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

        const entity2 = req.body;
        entity2.f_DOB = dob;

        delete entity2.dob;


        console.log(entity);
        // productmodels.insert(entity);
        res.render('upload', {
            title: 'Upload product'
        });
    }
}

module.exports = productController;