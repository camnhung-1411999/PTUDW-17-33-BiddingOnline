const usermodels = require('../models/user');
const db = usermodels.getAccount;

const cartmodels = require('../models/cart');
const dbcart = cartmodels.getCart;

const productmodels = require('../models/products');
const dbproduct = productmodels.getProduct;

const manageusermodels = require('../models/admin');
const dbmanageuser = manageusermodels.getManageUser;
const registerseller = require('../models/registerseller');
const dbregisterseller = registerseller.getRegister;

const category = require('../models/category');
const dbcategory = category.getCategory;

const bcrypt = require('bcryptjs');

var ObjectId = require('mongodb').ObjectId;

// for user

class userController {

    //Signup/in
    //----------get-----------------------
    showSignup(req, res) {
        req.logout();
        req.session.destroy();
        if (req.user != undefined && req.user != null) {
            router.redirect('/');
        }
        res.render('signup_in', {
            title: 'Sign in/ Sign up',
            checksignin: true,
            messenger: req.user
        });
    }
    //----------post----------------------
    async setPostSignup(req, res) {
        var arr = [];
        var a = +req.body.a;
        var b = +req.body.b;
        var c = a + b;
        var captcha = +req.body.captcha;

        var checkInfor = {
            fullname: req.body.fullname,
            name: req.body.name,
            pass: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            status: "Bidder",
            birthday: req.body.birthday
        };

        // kiem tra username co ton tai hay k
        await db.find({
            name: checkInfor.name
        }).then(function (docs) {
            // arr.push(docs);
            docs.forEach(element => {
                arr.push(element);
            })
        });
        if (arr.length != 0) {
            // res.redirect('/users/signup');
            res.render('signup_in', {
                title: 'Sign in/ Sign up',
                errusername: "*Username exist!",
                checksignup: true
            });
            arr = [];
        }
        // kiem tra mat khau lon hon 6 ki tu
        if (checkInfor.pass.length < 6) {
            res.render('signup_in', {
                title: 'Sign in/ Sign up',
                errpass: "*Password must be at least 6 characters!",
                checksignup: true
            });
        }
        // kiem tra mat khau nhap lai co khop k
        var repass = req.body.repassword;
        if (!(repass === checkInfor.pass)) {
            res.render('signup_in', {
                title: 'Sign in/ Sign up',
                errrepass: "*Do not match!",
                checksignup: true
            });
        }

        // kiem tra email tai hay k
        var i = 0;
        var temp = 1;
        for (i; i < checkInfor.email.length; i = i + 1) {

            if (checkInfor.email[i] === ' ') {
                temp = 0;
                i = checkInfor.email.length;
            } else {
                if (checkInfor.email[i] === '@') {
                    var a = "";
                    i = i + 1;
                    for (i; i < checkInfor.email.length; i++) {
                        a = a + checkInfor.email[i];
                        //a.push(checkInfor.email[j]);
                    }
                    if (a === "gmail.com" || a === "yahoo.com") {
                        temp = 1;
                    } else {
                        temp = 0;
                    }
                }
            }

        }
        if (temp === 0) {
            res.render('signup_in', {
                title: 'Sign in/ Sign up',
                erremail: "*Email wrong!",
                checksignup: true
            });
        }
        await db.find({
            email: checkInfor.email
        }).then(function (docs) {
            // arr.push(docs);
            docs.forEach(element => {
                arr.push(element);
            })
        });
        if (arr.length != 0) {
            // res.redirect('/users/signup');
            res.render('signup_in', {
                title: 'Sign in/ Sign up',
                erremail: "*Email exist!",
                checksignup: true
            });
            arr = [];
        }

        //kiem tra so dien thoai
        await db.find({
            phone: checkInfor.phone
        }).then(function (docs) {
            // arr.push(docs);
            docs.forEach(element => {
                arr.push(element);
            })
        });
        if (arr.length != 0) {
            // res.redirect('/users/signup');
            res.render('signup_in', {
                title: 'Sign in/ Sign up',
                errphone: "*Phone number exist!",
                checksignup: true
            });
            arr = [];
        }

        // kiem tra captcha
        if (c != captcha) {
            res.render('signup_in', {
                title: 'Sign in/ Sign up',
                errcaptcha: "*Captcha wrong!",
                checksignup: true
            });
        } else {
            await usermodels.hashPassword(checkInfor.pass).then(function (doc) {
                const user = {
                    fullname: checkInfor.fullname,
                    name: checkInfor.name,
                    pass: doc,
                    phone: checkInfor.phone,
                    email: checkInfor.email,
                    address: checkInfor.address,
                    status: checkInfor.status,
                    birthday: checkInfor.birthday,
                }
                usermodels.insert(user);
                const manageuser = {
                    name: checkInfor.name,
                    purchase: 0,
                    cacellate: 0,
                    type: false,
                    pointbid: 0,
                    pointsell: -1,
                }
                manageusermodels.insert(manageuser);
                res.redirect('/');
            });
        }
    }
    //for user
    //----------get-----------------------
    showAccount(req, res) {
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
        res.render('account', {
            title: 'Account',
            checkuser,
            nameuser,
            account: req.user,
        });
    }

    showFavorites(req, res) {
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
        res.render('favoriteproducts', {
            title: 'Favorites',
            checkuser,
            nameuser,
            account: req.user,
        });
    }
    async showCart(req, res) {
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

        var cart = [];
        await dbcart.find({
            user: req.user.name
        }).then(docs => {
            docs.forEach(element => {
                cart.push(element);
            })
        });

        // ObjectId;

        for (var i = 0; i < cart.length; i++) {
            await dbproduct.findOne({
                _id: ObjectId(cart[i].idsanpham)
            }).then(doc => {
                cart[i].tensp = doc.ten;
                cart[i].seller = doc.user;
                cart[i].image = doc.image[0];
            });
        }
        res.render('mycart', {
            title: 'My cart',
            checkuser,
            nameuser,
            cart
        });
    }

    showBid(req, res) {
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
        // ObjectId;
        res.render('mybid', {
            title: 'My Bid',
            checkuser,
            nameuser,
        });
    }

    showChangePassword(req, res) {
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
        res.render('changepassword', {
            title: 'Change password',
            checkuser,
            nameuser,
            account: req.user,
        });
    }
    //----------post----------------------
    async setPostAccount(req, res) {
        // var iduser=req.user._id;

        var myquery = {
            _id: req.user._id
        }
        var changeAcc = {
            fullname: req.body.fullnamechange,
            phone: req.body.phonechange,
            address: req.body.addresschange,
        };
        var options = {
            multi: true
        }
        // usermodels.UpdateInfoAccount(changeAcc,iduser);
        await db.update(myquery, changeAcc, options);
        res.redirect('/../users/account');
    }
    async setPostPassword(req, res) {
        var oldpass = req.body.oldpass;
        var newpass = req.body.newpass;
        var renewpass = req.body.renewpass;
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
        if (req.user != undefined && req.user != null) {
            bcrypt.compare(oldpass, req.user.pass, async (err, isMatch) => {
                console.log(isMatch);
                if (err) throw err;
                if (!isMatch) {
                    res.render('changepassword', {
                        title: 'Change password',
                        erroldpass: "*Password wrong!",
                        checkuser,
                        nameuser,
                    });
                } else {
                    //kiem tra matkhau moi co du 6 ki tu hay khong
                    if (newpass < 6) {
                        res.render('changepassword', {
                            title: 'Change password',
                            errnewpass: "*Password must be at least 6 characters!",
                            checkuser,
                            nameuser,
                        });
                    }
                    // kiem tra mat khau nhap lai co khop k
                    else if (!(newpass === renewpass)) {
                        res.render('changepassword', {
                            title: 'Change password',
                            errrenewpass: "*Do not match!",
                            checkuser,
                            nameuser,
                        });
                    } else {
                        var change;
                        await usermodels.hashPassword(newpass).then(function (doc) {
                            change = doc;
                        });
                        var myquery = {
                            _id: req.user._id
                        }
                        var changePass = {
                            pass: change,
                        };
                        var options = {
                            multi: true
                        }
                        // usermodels.UpdateInfoAccount(changeAcc,iduser);
                        await db.update(myquery, changePass, options);
                        res.redirect('/../users/account');
                    }

                }
            });
        }
    }
    async setPostRegisterSeller(req, res) {
        if (req.user != undefined && req.user != null) {
            var name = req.user.name;
        }
        var point;
        await dbmanageuser.findOne({ name }).then(doc => {
            point = doc.pointbid;
        });

        var entity = {
            name: name,
            point: point
        };
        await registerseller.insert(entity);
        res.redirect('/');
    }

    //for admin
    //----------get-----------------------
    async showManageUser(req, res) {
        var arrbid = [];
        var arrsell = [];
        var regist = [];
        await dbmanageuser.find({type: false}).then(docs => {
            docs.forEach(element => {
                // if (element.type) {
                //     arrsell.push(element);
                // }
                // else
                arrbid.push(element);
            })
        });

        // await dbregisterseller.find({}).then(docs => {
        //     docs.forEach(element => {
        //         regist.push(element);
        //     });
        // });
        var checkbid = false;
        // var checksell = false;
        // var checkregist = false;
        if (arrbid.length === 0) {
            checkbid = true;
        }
        // if (arrsell.length === 0) {
        //     checksell = true;
        // }
        // if (regist.length === 0) {
        //     checkregist = true;
        // }
        res.render('bidder', {
            title: "Manage user",
            listbid: arrbid,
            // listsell: arrsell,
            // listregist: regist,
            checkbid,
            // checksell,
            // checkregist,
            // totalregist: regist.length,
        });
    }
    async showListSell(req,res){
        // var arrbid = [];
        var arrsell = [];
        // var regist = [];
        await dbmanageuser.find({type:true}).then(docs => {
            docs.forEach(element => {
                 arrsell.push(element);
            })
        });

        // await dbregisterseller.find({}).then(docs => {
        //     docs.forEach(element => {
        //         regist.push(element);
        //     });
        // });
        // var checkbid = false;
        var checksell = false;
        // var checkregist = false;
        // if (arrbid.length === 0) {
        //     checkbid = true;
        // }
        if (arrsell.length === 0) {
            checksell = true;
        }
        // if (regist.length === 0) {
        //     checkregist = true;
        // }
        res.render('seller', {
            title: "Manage user",
            // listbid: arrbid,
            listsell: arrsell,
            // listregist: regist,
            // checkbid,
            checksell,
            // checkregist,
            // totalregist: regist.length,
        });
    }
    async showRegister(req,res){
        // var arrbid = [];
        // var arrsell = [];
        var regist = [];
       

        await dbregisterseller.find({}).then(docs => {
            docs.forEach(element => {
                regist.push(element);
            });
        });
        // var checkbid = false;
        // var checksell = false;
        var checkregist = false;
        // if (arrbid.length === 0) {
        //     checkbid = true;
        // }
        // if (arrsell.length === 0) {
        //     checksell = true;
        // }
        if (regist.length === 0) {
            checkregist = true;
        }
        res.render('register', {
            title: "Manage user",
            // listbid: arrbid,
            // listsell: arrsell,
            listregist: regist,
            // checkbid,
            // checksell,
            checkregist,
            totalregist: regist.length,
        });
    }
    async showManageCategory(req, res) {
        var arrCate = [];
        var check = [];
        var temp = [];
        await dbcategory.find({}).then(docs => {
            docs.forEach(element => {
                temp.push(element);
            })
        });
        for (var i = 0; i < temp.length; i++) {
            var existpro = [];
            var temp2 = {};
            await dbproduct.find({ loai: temp[i].idcat }).then(docs => {
                docs.forEach(elements => {
                    existpro.push(elements);
                });
            });
            if (existpro.length === 0 && temp[i].idcat != 'all') {
                temp2 = {
                    idcat: temp[i].idcat,
                    cate: temp[i].cate,
                    check: false,
                }
            }
            else {
                temp2 = {
                    idcat: temp[i].idcat,
                    cate: temp[i].cate,
                    check: true,
                }
            }
            arrCate.push(temp2);
        }
        res.render('managecategory', {
            title: "Manage Category",
            cate: arrCate,
        });
    }
    //----------post----------------------
    async setPostRegistConfirm(req, res) {
        var name = req.params.id;
        var acc = {};
        await db.findOne({ name }).then(doc => {
            acc = doc;
        })
        var myquery = {
            _id: ObjectId(acc._id)
        }
        var changeAcc = {
            status: "Seller",
        };
        var options = {
            multi: true
        }
        // usermodels.UpdateInfoAccount(changeAcc,iduser);
        await db.update(myquery, changeAcc, options);
        await dbregisterseller.findOneAndRemove({ name });
        res.redirect('/users/manageuser/register');
    }
    async setPostRegistDelete(req, res) {
        var name = req.params.id;
        await dbregisterseller.findOneAndRemove({ name });
        res.redirect('/users/manageuser/register');
    }

    async setPostDeleteCate(req, res) {
        var cate = req.body.cate;
        await dbcategory.findOneAndRemove({ cate });
        res.redirect('/users/managecategory');

    }
    async  setPostInsertCate(req, res) {
        var newcate = {
            cate: req.body.insert,
            idcat: req.body.idcat,
        }
        category.insert(newcate);

        res.redirect('/users/managecategory');

    }
    async setPostRenameCate(req, res) {
        var cate = req.body.oldcate;
        var findcate = {};
        await dbcategory.findOne({ cate }).then(doc => {
            findcate = doc;
        })
        var myquery = {
            _id: ObjectId(findcate._id)
        }
        var changeCate = {
            cate: req.body.newcate,
            idcat: req.body.newid,
        };
        var options = {
            multi: true
        }
        // usermodels.UpdateInfoAccount(changeAcc,iduser);
        await dbcategory.update(myquery, changeCate, options);
        res.redirect('/users/managecategory');
    }

}


module.exports = userController;

// async setPostSignin(req, res) {

    //     var arr = [];
    //     var checkSignin = {
    //         suname: req.body.username,
    //         supass: req.body.password,
    //     };
    //     //kiểm tra pass
    //     await db.find({
    //         name: checkSignin.suname
    //     }).then(function (docs) {
    //         // arr.push(docs);
    //         docs.forEach(element => {
    //             arr.push(element);
    //         })
    //     });
    //     console.log(arr);
    //     if (arr.length === 0) {
    //         res.render('signup_in', {
    //             title: 'Sign in/ Sign up',
    //             checksignin: true,
    //             errsiname: "*Username wrong!"
    //         });
    //     } else {
    //         bcrypt.compare(checkSignin.supass, arr[0].pass, (err, isMatch) => {
    //             if(!isMatch){
    //                 res.render('signup_in', {
    //                     title: 'Sign in/ Sign up',
    //                     checksignin: true,
    //                     errsiname: "*Password wrong!"
    //                 });
    //             }
    //             else if(checkSignin.user==="admin"){
    //                 res.redirect('/admin');
    //             }
    //         });
    //     }
    // }