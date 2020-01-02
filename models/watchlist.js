const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoangman:123@cluster0-ascy6.mongodb.net/test?retryWrites=true&w=majority";
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;

mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
var db = mongoose.connection;

var WatchlistSchema = new mongoose.Schema({
    _id: ObjectId,
    idsanpham: String,
    user: String
}, {
    collection: "watchlist"
});

// ProductsSchema.index({loai :'text'});
var Watchlist = db.useDb("udweb-nhom7").model('Watchlist', WatchlistSchema);

module.exports = {
    insert: (entity) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("udweb-nhom7");
            dbo.collection("watchlist").insertOne(entity, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    },
    getWatchlist: Watchlist
}