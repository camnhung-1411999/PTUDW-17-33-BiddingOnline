var ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoangman:123@cluster0-ascy6.mongodb.net/test?retryWrites=true&w=majority";
var mongoose = require('mongoose');
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
var db = mongoose.connection;

var reviewSchema = new mongoose.Schema({
    _id: ObjectId,
    idsanpham: String,
    rate: Number,
    comment: String,
    userrate: String,
    user: String,
}, {
    collection: "reviews"
});

// ProductsSchema.index({loai :'text'});
var Reviews = db.useDb("udweb-nhom7").model('Reviews', reviewSchema);

module.exports = {
    insert: (entity) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("udweb-nhom7");
            dbo.collection("reviews").insertOne(entity, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    },
    getReviews: Reviews,

}