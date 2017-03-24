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



let insertUser = (userInfo) => {
    return getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.insertOne({
                name: userInfo.name,
                email: userInfo.email,
                password: userInfo.password,
                purview: "user",
            }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        _id: result.ops[0]._id,
                        email: userInfo.email,
                        name: userInfo.name,
                        purview: "user",
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
                    resolve({
                        _id: result._id,
                        email: result.email,
                        name: result.name,
                        purview: result.purview,
                    });
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

let getUidByToken = (token) => {
    return getCollection(config.token).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ token }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result._uid);
                }
                db.close();
            });
        });
    });
}

let updateUserById = (id, userInfo) => {
    return getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.updateOne({ _id: id }, {
                $set: {
                    name: userInfo.name,
                    password: userInfo.password,
                }
            }, function (err, result) {
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

let checkPassword = (email, password) => {
    return getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ email }, function (err, result) {
                if (err) {
                    reject("database error.");
                }
                else if (result === null) {
                    reject("user not exist.");
                }
                else if (result.password === password) {
                    resolve("pass.");
                }
                else {
                    reject("wrong password.");
                }
            });
            db.close();
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

let insertToken = (_uid) => {
    return createToken().then((token) => {
        return getCollection(config.token).then(({ db, collection }) => {
            return new Promise((resolve, reject) => {
                let now = new Date();
                let dispose = new Date();
                dispose.setDate(dispose.getDate() + config.renewTime);

                collection.insertOne({
                    _uid,
                    create: now.getTime(),
                    dispose: dispose.getTime(),
                    token: token,
                }, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({
                            _id: result.ops[0]._id,
                            token,
                            dispose: result.ops[0].dispose,
                        });
                    }
                });
            });
        });
    });
}

let removeToken = (_uid) => {
    return getCollection(config.token).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.remove({ _uid }, function (err, result) {
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

let renewToken = (_uid) => {
    return getCollection(config.token).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            let dispose = new Date();
            dispose.setDate(dispose.getDate() + config.renewTime);
            collection.updateOne({ _uid }, {
                $set: {
                    dispose: dispose.getTime(),
                }, function(err, result) {
                    if (err) {
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

let getTokenByUid = (_uid) => {
    return getCollection(config.token).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ _uid }, function (err, result) {
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

let getTokenByToken = (token) => {
    return getCollection(config.token).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.findOne({ token }, function (err, result) {
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


let setAdmin = (email) => {
    return getCollection(config.user).then(({ db, collection }) => {
        return new Promise((resolve, reject) => {
            collection.updateOne({ email }, { $set: { purview: "admin" } }, function (err, result) {
                if (err) {
                    reject(err);
                }
                else if (result.n === 1) {
                    resolve("ok");
                }
                else {
                    reject("database error.");
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
    getUserById,
    getUserByEmail,
    updateUserById,
    removeUserById,

    checkPassword,

    createToken,
    insertToken,
    removeToken,
    renewToken,
    getTokenByUid,
    getTokenByToken,

    setAdmin,
}
