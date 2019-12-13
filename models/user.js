const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hoangman:123@cluster0-ascy6.mongodb.net/test?retryWrites=true&w=majority";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });



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
    }
}