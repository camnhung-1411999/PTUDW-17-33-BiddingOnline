const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoangman:123@cluster0-ascy6.mongodb.net/test?retryWrites=true&w=majority";

var mongoose = require('mongoose');
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
var db = mongoose.connection;
var registerSellerSchema = new mongoose.Schema({
    _id: Object,
    name:String,
    point:Number,
}, {
    collection: "registerseller"
});

// ProductsSchema.index({loai :'text'});
var Register = db.useDb("udweb-nhom7").model('Register', registerSellerSchema);
module.exports = {
    insert: (entity) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("udweb-nhom7");
            dbo.collection("registerseller").insertOne(entity, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    },
    getRegister: Register,

}