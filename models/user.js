const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoangman:123@cluster0-ascy6.mongodb.net/test?retryWrites=true&w=majority";
const bcrypt = require('bcryptjs');

var nodemailer = require("nodemailer");

var mongoose = require('mongoose');
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
var db = mongoose.connection;
var accountSchema = new mongoose.Schema({
    fullname: String,
    name: String,
    pass: String,
    email: String,
    phone: String,
    address: String,
    status: String,
    birthday: String,
    pluspoint: Number,
    minuspoint: Number,
    pointbid: Number,
    rate: Number,
    totalproduct: Number,
}, {
    collection: "account"
});
var Account = db.useDb("udweb-nhom7").model("account", accountSchema);

module.exports = {
    insert: (entity) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("udweb-nhom7");
            dbo.collection("account").insertOne(entity, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    },
    hashPassword: async (password) => {
        try {
            const salt = await bcrypt.genSalt(10);
            var result = await bcrypt.hash(password, salt);
            return result;
        } catch (error) {
            throw new Error('Hashing failed', error)
        }
    },
    UpdateInfoAccount: async (user, id) => {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("udweb-nhom7");
            var dbt = dbo.collection("account");
            dbt.updateOne(
                { _id: id },
                {
                    $set: user
                }
            )
            db.close();
        });
    },
    getAccount: Account,
    sendemail: (req, res, next) => {
        var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "",
                pass: ""
            }
        });
        var randnum, mailOptions, host, link;
        randnum = Math.floor((Math.random() * 10000) + 54);
        const newid = new VerifyModel({ userid: res.locals.user._id, id: randnum });
        newid.save();
        mailOptions = {
            to: "email@gmail.com",
            subject: "Requesting to create your new password",
            html: "Hello,<br>This is your forget password code:  " + randnum
        }
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                res.end("error");
            } else {
                console.log("Message sent: " + response.message);
                res.end("sent");
            }
        });

    }

}