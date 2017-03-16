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
        return new Promise((resolve, reject) => {
            collection.insertOne({ link: linkUrl, count: 0 }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    });
};

let updateLinkById = (id) => {
    return getCollection(config.urls).then(({ collection }) => {
        return new Promise((resolve, reject) => {
            collection.updateOne({ _id: id }, { link: linkUrl }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    });
}

let removeLinkById = (id) => {
    return getCollection(config.urls).then(({ collection }) => {
        return new Promise((resolve, reject) => {
            collection.remove({ _id: id }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    });
}

let findLinkById = (id) => {
    return getCollection(config.urls).then(({ collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ _id: id }, { fields: { link: 1 } }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    });
}

let getCountById = (id) => {
    return getCollection(config.urls).then(({ collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ _id: id }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    });
}

module.exports = {
    insertLink: insertLink,
    updateLinkById: updateLinkById,
    removeLinkById: removeLinkById,
    findLinkById: findLinkById,
}
