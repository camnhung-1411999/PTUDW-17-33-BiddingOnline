var express = require('express');
var moment = require('moment');
var router = express.Router();
const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;
var ObjectId = require('mongodb').ObjectId;
const biddingmodels = require('../models/bidding');
const dbbidding = biddingmodels.getBidding;

router.get('/', async function (req, res) {
  var checkuser = false;
  var username;
  if (req.user) {
    checkuser = true;
    username = req.user.name;
    var isSeller = false;
    if (req.user.status === "Seller") {
      isSeller = true;
    }
  }
  var giacaonhat = [];
  var ragianhieunhat = [];
  var thoigiansaphet = [];


  var thoigiansaphet2 = [];
  // thoi gian sap het
  await dbproduct.find({
    selling: true
  }).then((docs) => {
    docs.forEach(element => {
      thoigiansaphet.push(element);
    })
  });

  var ragianhieunhattemp = [];
  await dbbidding.find({
    selling: true
  }).sort({
    soluot: -1
  }).limit(5).then(docs => {
    docs.forEach(element => {
      ragianhieunhattemp.push(element);
    })
  });

  for (var i = 0; i < ragianhieunhattemp.length; i++) {
    await dbproduct.findOne({
      _id: ObjectId(ragianhieunhattemp[i].idsanpham)
    }).then(doc => {
      ragianhieunhat.push(doc);
      ragianhieunhat[i].soluot = ragianhieunhattemp[i].soluot;
    })
  }

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

  for (var i = 0; i < giacaonhat.length; i++) {
    giacaonhat[i].soluot = 0;
  }

  for (var i = 0; i < giacaonhat.length; i++) {
    await dbbidding.findOne({
      idsanpham: giacaonhat[i]._id.toString()
    }).then(doc => {
      if (doc) {
        giacaonhat[i].soluot = doc.soluot;
      }
    });
  }

  const now = moment(new Date(), 'YYYY/MM/DD HH:ii');

  for (var i = 0; i < giacaonhat.length; i++) {
    const time = moment(giacaonhat[i].datetime, 'YYYY/MM/DD HH:ii');
    const c = now.diff(time, 'seconds');
    if (giacaonhat[i].datetimeproduct * 24 * 3600 + giacaonhat[i].moretime > c) {
      giacaonhat[i].datetimeproduct = giacaonhat[i].datetimeproduct * 24 * 3600 + giacaonhat[i].moretime - c;
    }
  }

  for (var i = 0; i < ragianhieunhat.length; i++) {
    var time1 = ragianhieunhat[i].datetime;
    var c1 = now.diff(time1, 'seconds');
    if (ragianhieunhat[i].datetimeproduct * 24 * 3600 + ragianhieunhat[i].moretime >= c1) {
      ragianhieunhat[i].datetimeproduct = ragianhieunhat[i].datetimeproduct * 24 * 3600 + ragianhieunhat[i].moretime - c1;
    }
  }

  for (var i = 0; i < thoigiansaphet.length; i++) {

    time2 = thoigiansaphet[i].datetime;
    var c2 = now.diff(time2, 'seconds');
    if (thoigiansaphet[i].datetimeproduct * 24 * 3600 + thoigiansaphet[i].moretime >= c2) {
      thoigiansaphet[i].datetimeproduct = thoigiansaphet[i].datetimeproduct * 24 * 3600 + thoigiansaphet[i].moretime - c2;
    }
  }

  var n = thoigiansaphet.length;
  for (var i = 0; i < n; i++) {
    for (var j = i + 1; j < n; j++) {
      if (thoigiansaphet[i].datetimeproduct > thoigiansaphet[j].datetimeproduct) {
        var temp = thoigiansaphet[i];
        thoigiansaphet[i] = thoigiansaphet[j];
        thoigiansaphet[j] = temp;
      }
    }
  }

  for (var i = 0; i < 5; i++) {
    thoigiansaphet2.push(thoigiansaphet[i]);
    thoigiansaphet2[i].soluot = 0;
    await dbbidding.findOne({
      idsanpham: giacaonhat[i]._id.toString()
    }).then(doc => {
      if (doc) {
        thoigiansaphet2[i].soluot = doc.soluot;
      }
    });

  }
  res.render('home', {
    title: 'Home',
    checkuser,
    isSeller,
    mostprices: giacaonhat,
    mostbids: ragianhieunhat,
    neartimeout: thoigiansaphet2,
    home: true,
    nameuser: username,
  });
});
router.get('/admin', function (req, res) {
  res.render('adminaccount', {
    title: 'Admin'
  })
});




module.exports = router;