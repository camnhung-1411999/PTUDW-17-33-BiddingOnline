const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoangman:123@cluster0-ascy6.mongodb.net/test?retryWrites=true&w=majority";
var mongoose = require('mongoose');
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
var db = mongoose.connection;

var CartSchema = new mongoose.Schema({
    _id: Object,
    idsanpham: Object,
    user: String,
    giadau: Number,
    giaphaitra: Number,
    datebuy: Date,
    tensp: String,
    seller: String,
    image: String
}, {
    collection: "cart"
});

// ProductsSchema.index({loai :'text'});
var Cart = db.useDb("udweb-nhom7").model('Cart', CartSchema);

module.exports = {
    insert: (entity) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("udweb-nhom7");
            dbo.collection("cart").insertOne(entity, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    },
    getCart: Cart

}