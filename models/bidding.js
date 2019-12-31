const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoangman:123@cluster0-ascy6.mongodb.net/test?retryWrites=true&w=majority";
var mongoose = require('mongoose');
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
var db = mongoose.connection;

var BiddingSchema = new mongoose.Schema({
    _id: Object,
    idsanpham: Object,
    bidding: [],
    datebid: Date,
    soluot: Number,
    selling: Boolean
}, {
    collection: "bidding"
});

// ProductsSchema.index({loai :'text'});
var Bidding = db.useDb("udweb-nhom7").model('bidding', BiddingSchema);

module.exports = {
    insert: (entity) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("udweb-nhom7");
            dbo.collection("bidding").insertOne(entity, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    },
    getBidding: Bidding,

}