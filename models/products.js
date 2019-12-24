const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoangman:123@cluster0-ascy6.mongodb.net/test?retryWrites=true&w=majority";

var mongoose = require('mongoose');
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
var db = mongoose.connection;
var ProductsSchema = new mongoose.Schema({
    _id: Object,
    image: [],
    ten: String,
    giahientai: Number,
    giatoithieu: Number,
    giamuangay: Number,
    buocdaugia: Number,
    loai: String,
    datetime: Date,
    datetimeproduct: Number,
    ghichu: String,
    selling: Boolean,
    user: String
}, {
    collection: "product"
});
var Product = db.useDb("udweb-nhom7").model('product', ProductsSchema);
module.exports = {
    insert: (entity) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("udweb-nhom7");
            dbo.collection("product").insertOne(entity, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    },
    getProduct: Product,

    getLimitSkipandSort: async (nameSort, limit, skip) => {
        var product = [];
        await Product.find({}).skip(skip).limit(limit).then((docs) => {
            return docs;
        })
        // return product;
    }

}