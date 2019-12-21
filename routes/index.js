var express = require('express');
var router = express.Router();
const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;
/* GET home page. */



/* GET home page. */
router.get('/', async function (req, res) {
  var checkuser = false;
  if (req.user) {
    checkuser = true;
    var isSeller = true;
    if (req.user.status != "Seller") {
      isSeller = false;
    }
  }
  // var a = Promise.resolve([]);
  var giacaonhat = [];
  var ragianhieunhat = [];
  var thoigiansaphet = [];
  //thoi gian sap het
  // await dbproduct.find({}).limit(5).then((docs) => {
  //   docs.forEach(element => {
  //     ragianhieunhat.push(element);
  //   })
  // })
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
  res.render('home', {
    title: 'Home',
    checkuser,
    isSeller,
    mostprices: giacaonhat,
    mostbids: ragianhieunhat
  });
});





module.exports = router;