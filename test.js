

const mongoway = require('./dataoption/mongoway');

mongoway.getCollection("test").then(({ db, collection }) => {
    collection.insertMany([{ a: 1, b: 1 }, { a: 2, b: 2 }, { a: 3, b: 3 }], { w: 1 }, function (err, result) {

        // Perform a simple find and return all the documents
        collection.find({})
            .skip(1)
            .limit(1000)
            .toArray(function (err, docs) {
                console.log(docs);
                db.close();
            });
    });
});