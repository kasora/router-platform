'use strict';

const express = require('express');
const database = require('./data').database;
const ObjectID = require('mongodb').ObjectID;
const config = require('../config');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const randomstring = require('randomstring');

let router = express.Router();

let replaceMongoId = (req, res, next) => {
    if (req.query.uid !== undefined) {
        if (config.dataWay === "mongodb") {
            try {
                req.query._uid = new ObjectID(req.query.uid);
            } catch (err) {
                res.status(404).send({
                    err: "uid error.",
                });
                return;
            }
        }
    }
    if (req.query.linkid != undefined) {
        if (config.dataWay === "mongodb") {
            try {
                req.query._linkid = new ObjectID(req.query.linkid);
            } catch (err) {
                res.status(404).send({
                    err: "linkid error.",
                });
                return;
            }
        }
    }
    next();
}
let updateToken = (req, res, next) => {
    if (req.cookies.token !== undefined) {
        database.getTokenByToken(req.cookies.token).then((tokenResult) => {
            let now = new Date();
            if ((now.getTime() > tokenResult.dispose) ||
                (now.getTime() - tokenResult.create > config.disposeTime * 24 * 60 * 60 * 1000)) {
                next();
            }
            else {
                database.renewTokenByToken(req.cookies.token).then((result) => {
                    next();
                }, (err) => {
                    res.status(500).send({ err: "database error." })
                });
            }
        }, (err) => {
            next();
        });
    }
    else {
        next();
    }
}
let getUid = (req, res, next) => {
    if (!req.cookies.token) {
        req.query._uid = undefined;
        next();
    }
    else {
        database.getTokenByToken(req.cookies.token).then((tokenResult) => {
            req.query._uid = tokenResult._uid;
            next();
        }, (err) => {
            if (err === "token error.") {
                req.query._uid = undefined;
                next();
            }
            else {
                res.status(500).send({ err: "database error." });
            }
        });
    }
}
let checkUserPurview = (req, res, next) => {
    if (req.cookies.token === undefined) {
        req.query.purview = "guest";
        next();
    }
    else {
        database.getTokenByToken(req.cookies.token).then((tokenResult) => {
            database.getUserById(tokenResult._uid).then((result) => {
                if (result.email === req.query.email) {
                    req.query.purview = "owner";
                    next();
                }
                else if (result.purview === "admin") {
                    req.query.purview = "admin";
                    next();
                }
                else {
                    req.query.purview = "guest";
                    next();
                }
            }, (err) => {
                if (err === "user error.") {
                    req.query.purview = "guest";
                    next();
                }
                else {
                    res.status(500).send({ err: "database error." });
                }
            });
        }, (err) => {
            if (err === "token error.") {
                req.query.purview = "guest";
                next();
            }
            else {
                res.status(500).send({ err: "database error." })
            }
        });
    }
}

// compatible post body
router.use(['/link', '/route'], (req, res, next) => {
    req.query.link = req.query.link || req.body.link || req.query.newlink || req.body.newlink;
    req.query.uid = req.query.uid || req.body.uid;
    req.query.linkid = req.query.linkid || req.body.linkid;
    req.query.page = req.query.page || req.body.page;
    req.query.per_page = req.query.per_page || req.body.per_page;

    if (req.query.link) {
        if (!/^http/.test(req.query.link))
            req.query.link = `http://` + req.query.link;
    }
    next();
})
router.use(['/user', '/login'], (req, res, next) => {
    req.query.email = req.query.email || req.body.email;
    req.query.password = req.query.password || req.body.password;
    req.query.name = req.query.name || req.body.name;
    next();
});

router.use(replaceMongoId);
router.use(updateToken);
router.use(checkUserPurview);
router.use(getUid);

router.use(require('./user'));
router.use(require('./link'));
router.use(require('./login'));
router.use(require('./routeLink'));

module.exports = router;
