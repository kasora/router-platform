"use strict"

const MongoClient = require('mongodb').MongoClient
const config = require('../config');

let getCollection = (docName) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.dbUrl, (err, db) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    db: db,
                    collection: db.collection(docName)
                });
            }
        });
    })
};

let insertLink = (linkUrl) => {
    return getCollection(config.urls).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.insertOne({ link: linkUrl, count: 0 }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ id: result.ops[0]._id });
                }
                db.close();
            });
        });
    });
};

let updateLinkById = (id, linkUrl) => {
    return getCollection(config.urls).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.updateOne({ _id: id }, { $set: { link: linkUrl } }, { upsert: true }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                db.close();
            });
        });
    });
}

let removeLinkById = (id) => {
    return getCollection(config.urls).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.remove({ _id: id }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                db.close();
            });
        });
    });
}

let getLinkById = (id) => {
    return getCollection(config.urls).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ _id: id }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                db.close();
            });
        });
    });
}

let getCountById = (id) => {
    return getCollection(config.urls).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ _id: id }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                db.close();
            });
        });
    });
}

let setCountById = (id, times) => {
    return getCollection(config.urls).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.updateOne({ _id: id }, { $set: { count: times } }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                db.close();
            });
        });
    });
}

let addCountById = (id) => {
    return getCountById(id).then((result) => {
        return setCountById(id, result.count + 1);
    });
}

let checkEmail = (email) => {
    getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ email: email }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    if (!result) resolve('You can use this Email.');
                    else reject('Email is exist.');
                }
                db.close();
            })
        });
    });
}

let insertUser = (userInfo) => {
    getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.insertOne(userInfo, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ id: result.ops[0]._id });
                }
                db.close();
            });
        });
    });
}

let getUserById = (id) => {
    return getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ id: id }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                db.close();
            });
        });
    });
}

let getUserByEmail = (email) => {
    return getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ email: email }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                db.close();
            });
        });
    });
}

let updateUserById = (id, userInfo) => {
    return getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.updateOne({ _id: id }, { $set: userInfo }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                db.close();
            });
        });
    });
}

let removeUserById = (id) => {
    return getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.remove({ _id: id }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                db.close();
            });
        });
    });
}

module.exports = {
    insertLink: insertLink,
    updateLinkById: updateLinkById,
    removeLinkById: removeLinkById,
    getLinkById: getLinkById,
    getCountById: getCountById,
    setCountById: setCountById,
    addCountById: addCountById,
    insertUser: insertUser,
    checkEmail: checkEmail,
    getUserById: getUserById,
    getUserByEmail: getUserByEmail,
    updateUserById: updateUserById,
    removeUserById: removeUserById,
}
