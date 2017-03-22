"use strict"

const MongoClient = require('mongodb').MongoClient
const config = require('../config');
const randomstring = require('randomstring');

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
    return getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.insertOne(userInfo, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        _id: result.ops[0]._id,
                        email: userInfo.email,
                        name: userInfo.name,
                    });
                }
                db.close();
            });
        });
    });
}

let getUserById = (_id) => {
    return getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ _id: _id }, function (err, result) {
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

let createToken = () => {
    return getCollection(config.token).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            let token = randomstring.generate();
            collection.findOne({ token: token }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else if (result) {
                    reject('token is exist');
                }
                else {
                    resolve(token);
                }
                db.close();
            });
        }).then((token) => {
            return Promise.resolve(token);
        }, (err) => {
            if (err === 'token is exist') {
                return createToken();
            }
        });
    });
}

let insertToken = (_id) => {
    return createToken().then((token) => {
        return getCollection(config.token).then(({ db, collection }) => {
            return new Promise((resolve, reject) => {
                let now = new Date();
                let dispose = new Date();
                dispose.setDate(dispose.getDate() + config.disposeTime);

                collection.insertOne({
                    uid: _id,
                    create: now.getTime(),
                    dispose: dispose.getTime(),
                    token: token,
                }, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({
                            token,
                            dispose: result.ops[0].dispose,
                        });
                    }
                });
            });
        });
    });
}

let renewToken = (token) => {
    getCollection(config.token).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.updateOne({ token: token }, {
                $set: {
                    dispose: new Date().setDate(new Date().getDate() + 1).getTime()
                }, function(err, result) {
                    if (!err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                    db.close();
                }
            });
        });
    });
}

module.exports = {
    insertLink,
    updateLinkById,
    removeLinkById,
    getLinkById,
    getCountById,
    setCountById,
    addCountById,
    insertUser,
    checkEmail,
    getUserById,
    getUserByEmail,
    updateUserById,
    removeUserById,
    insertToken,
}
