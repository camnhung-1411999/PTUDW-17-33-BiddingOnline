class userController {
    showSignup(req, res) {
        res.render('signup_in', { title: 'Sign in/ Sign up' });

    }

    showAccount(req,res){
        res.render('account',{title: 'Account'});
    }
}


module.exports = userController;