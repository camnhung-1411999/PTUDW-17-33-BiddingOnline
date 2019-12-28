var express = require('express');
var moment = require('moment');
var router = express.Router();
const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;
/* GET home page. */



/* GET home page. */
router.get('/', async function (req, res) {
  var checkuser = false;
  var username;
  if (req.user) {
    checkuser = true;
    username = req.user.name;
    var isSeller = false;
    if (req.user.status === "seller") {
      isSeller = true;
    }
  }
  var giacaonhat = [];
  var ragianhieunhat = [];
  var thoigiansaphet = [];
  // thoi gian sap het
  await dbproduct.find({
    selling: true
  }).sort({
    datetimeproduct: -1
  }).limit(5).then((docs) => {
    docs.forEach(element => {
      thoigiansaphet.push(element);
    })
  })
  //nhieu danh gia nhat
  await dbproduct.find({
    selling: true
  }).limit(5).then((docs) => {
    docs.forEach(element => {
      ragianhieunhat.push(element);
    })
  })

  //gia cao nhat
  await dbproduct.find({
    selling: true
  }).sort({
    giahientai: -1
  }).limit(5).then(docs => {
    docs.forEach(element => {
      giacaonhat.push(element);
    })
  });

  const now = moment(new Date());
  for (var i = 0; i < giacaonhat.length; i++) {
    const time = giacaonhat[i].datetime;
    const c = now.diff(time, 'seconds');
    if (giacaonhat[i].datetimeproduct * 24 * 3600 + giacaonhat[i].moretime > c) {
      giacaonhat[i].datetimeproduct = giacaonhat[i].datetimeproduct * 24 * 3600 + giacaonhat[i].moretime - c;
    }

    var time1 = ragianhieunhat[i].datetime;
    var c1 = now.diff(time1, 'seconds');
    if (ragianhieunhat[i].datetimeproduct * 24 * 3600 + ragianhieunhat[i].moretime >= c1) {
      ragianhieunhat[i].datetimeproduct = ragianhieunhat[i].datetimeproduct * 24 * 3600 + ragianhieunhat[i].moretime - c1;
    }

    time2 = thoigiansaphet[i].datetime;
    var c2 = now.diff(time2, 'seconds');
    if (thoigiansaphet[i].datetimeproduct * 24 * 3600 + thoigiansaphet[i].moretime >= c2) {
      thoigiansaphet[i].datetimeproduct = thoigiansaphet[i].datetimeproduct * 24 * 3600 + thoigiansaphet[i].moretime - c2;
    }

  }
  res.render('home', {
    title: 'Home',
    checkuser,
    isSeller,
    mostprices: giacaonhat,
    mostbids: ragianhieunhat,
    neartimeout: thoigiansaphet,
    home: true,
    nameuser: username,
  });
});





module.exports = router;