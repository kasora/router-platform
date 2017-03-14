"use strict"


const MongoClient = require('mongodb').MongoClient
const config = require('../config');

// Connection URL 
let getCollection = (docName) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.dbUrl, (err, db) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    db,
                    collection: db.collection(docName)
                });
            }
        });
    })
}

let insertLink = (LinkUrl) => {
    getCollection("Links").then(({db,collection}) => {
        Promise
    });
    // Insert some documents 
    collection.insertMany([
        { a: 1 }, { a: 2 }, { a: 3 }
    ], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
}
