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
                    collection: db.collection(docName)
                });
            }
        });
    })
};

let insertLink = (LinkUrl) => {
    return getCollection(config.urls).then(({ collection }) => {
        collection.insert({ link: LinkUrl, count: 0 }, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                console.log(result.ops[0]._id);
                resolve(result.ops[0]._id);
            }
        })
    })
};

module.exports = {
    insertLink: insertLink,
}
