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

let insertLink = (linkUrl) => {
    return getCollection(config.urls).then(({ collection }) => {
        collection.insert({ link: linkUrl, count: 0 }, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                console.log(`New Link is added. Id is ${result.ops[0]._id}.`);
                resolve(result);
            }
        })
    })
};

let updateLinkById = (id, linkUrl) => {
    return getCollection(config.urls).then(({ collection }) => {
        collection.update({ _id: id }, { link: linkUrl }, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                console.log(`${result.ops[0]._id} is changed. New Link is ${linkUrl}`);
                resolve(result);
            }
        });
    });
}

let removeLinkById = (id, linkUrl) => {
    return getCollection(config.urls).then(({ collection }) => {
        collection.remove({ _id: id }, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                console.log(`The link which id is ${result.ops[0]._id} has disposed.`);
                resolve(result);
            }
        });
    });
}

let findLinkById = (id, linkUrl) => {
    return getCollection(config.urls).then(({ collection }) => {
        collection.find({ _id: id }).toArray(function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    insertLink: insertLink,
    updateLinkById: updateLinkById,
    removeLinkById: removeLinkById,
    findLinkById: findLinkById,
}
