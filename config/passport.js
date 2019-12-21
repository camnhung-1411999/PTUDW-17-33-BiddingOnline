var LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt=require('bcryptjs');
var User= require('../models/user').getAccount;

//lưu cookie
passport.serializeUser(function (user, done) {
    done(null, user.name);
});
//lấy cookie
passport.deserializeUser(function (name, done) {
    User.findOne({name:name}).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        console.log(err);
    })
});
module.exports =function (passport) {
    passport.use(new LocalStrategy(
        (username, password, done) => {
            if(!username||!password)
                return done(null, false,{message:'Vui lòng điền đầy đủ thông tin'});
            User.findOne({
                name:username
            }).then(async function (user) {
                if(!user)
                    return done(null,false,{message:'Tài khoản chưa được đăng ký'});
                bcrypt.compare(password,user.pass,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch) return done(null,user);
                    else return done(null, false,{message:'Mật khẩu không đúng'});
                });    
            }).catch(function (err) {
                return done(err);
            });
        }
    ));
}