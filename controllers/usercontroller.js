const usermodels = require('../models/user');
const db = usermodels.getAccount;

class userController {
    showSignup(req, res) {
        res.render('signup_in', { title: 'Sign in/ Sign up' });
    }

    showAccount(req, res) {
        res.render('account', { title: 'Account' });
    }

    async setPostSignup(req, res) {
        var checkInfor = {
            name: req.body.name,
            pass: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
        };

        console.log(checkInfor);

        await usermodels.insert(checkInfor);

        res.redirect('/');
    }
    async setPostSignin(req, res) {

        var arr =[];
        var errors = [];
        var checkSignin = {
            suname: req.body.suname,
            supass: req.body.supass,
        };
        //kiểm tra pass
        await db.find({ name: checkSignin.suname }).then(function (docs) {
            // arr.push(docs);
            docs.forEach(element=>{
                arr.push(element);
            })
        });
        if(arr.length === 0)
        {
            errors.push({msg: "không tồn tại"});
            // res.redirect('/users/signup');
            res.render('signup_in',{
                title: 'Sign in/ Sign up',
                error: errors[0].msg
            });
        }else if(arr[0].pass===checkSignin.supass){
            res.redirect('/');
        }
        else{
            errors.push({msg:"Mật khẩu sai!"});
            res.render('signup_in',{
                title: 'Sign in/ Sign up',
                error: errors[0].msg
            });

        }
    }

}


module.exports = userController;