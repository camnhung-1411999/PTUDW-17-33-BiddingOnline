const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoangman:123@cluster0-ascy6.mongodb.net/test?retryWrites=true&w=majority";

var mongoose = require('mongoose');
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
var db = mongoose.connection;
var ManegeUserSchema = new mongoose.Schema({
    _id: Object,
    name:String,
    purchase:Number,
    cancellate:Number,
    pointsell:Number,
    pointbid:Number,
    type:Boolean,
}, {
    collection: "manageuser"
});

// ProductsSchema.index({loai :'text'});
var Manageuser = db.useDb("udweb-nhom7").model('Manageuser', ManegeUserSchema);
module.exports = {
    insert: (entity) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("udweb-nhom7");
            dbo.collection("manageuser").insertOne(entity, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    },
    getManageUser: Manageuser,

}