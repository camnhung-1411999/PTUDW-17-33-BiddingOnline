const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoangman:123@cluster0-ascy6.mongodb.net/test?retryWrites=true&w=majority";
const bcrypt = require('bcryptjs');

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
    UpdateInfoAccount: async (user, id)=> {
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

}