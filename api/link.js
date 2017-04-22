'use strict';

const express = require('express');
const database = require('./data').database;
const config = require('../config');
const randomstring = require('randomstring');

let router = express.Router();

let checkLinkPurview = (req, res, next) => {
    if (req.cookies.token === undefined) {
        res.status(401).send({ err: "purview error." });
        return;
    }
    database.getTokenByToken(req.cookies.token).then((tokenResult) => {
        database.getUserById(tokenResult._uid).then((result) => {
            if (result.purview === "admin") {
                req.query.linkPurview = "admin";
                next();
                return;
            }
            database.getLinkById(req.query._linkid).then((linkResult) => {
                if (linkResult._uid.toString() === tokenResult._uid.toString()) {
                    req.query.linkPurview = "owner";
                    next();
                    return;
                }
                else {
                    res.status(401).send({ err: "token error." });
                }
            }, (err) => {
                if (err === "user error.") {
                    res.status(401).send({ err: "token error." });
                }
                else {
                    res.status(500).send({ err: "database error." });
                }
            });
        }, (err) => {
            if (err === "user error.") {
                res.status(401).send({ err: "token error." });
            }
            else {
                res.status(500).send({ err: "database error." });
            }
        });
    }, (err) => {
        if (err === "token error.") {
            res.status(401).send({ err });
        }
        else {
            res.status(500).send({ err: "database error." })
        }
    });
}

let insertLink = (req, res) => {
    if (!req.query.link) {
        return res.status(400).send({
            err: "link error.",
        });
    }
    database.insertLink(req.query.link, req.query._uid).then((result) => {
        res.status(201).send({
            uid: req.query._uid,
            linkid: result._id,
            link: req.query.link,
            count: 0,
        });
    }, (err) => {
        res.sendStatus(500);
    });
}
let removeLink = (req, res) => {
    database.removeLinkById(req.query._linkid).then((result) => {
        res.status(204).send({});
    }, (err) => {
        res.status(500).send({ err: "database error." });
    });
}
let updateLink = (req, res) => {
    if (!req.query.newlink) {
        return res.status(400).send({
            err: "link error.",
        });
    }
    database.getLinkById(req.query._linkid).then((linkResult) => {
        database.getLinksByUid(linkResult._uid, 0, 100000000).then((links) => {
            for (let element of links) {
                if (req.query.newlink.search(element._id.toString()) != -1) {
                    return res.status(400).send({
                        err: "link error.",
                    });
                }
            }
            database.updateLinkById(req.query._linkid, req.query.newlink).then((result) => {
                res.status(201).send(linkResult);
            });
        })

    }, (err) => {
        res.status(500).send({ err: "database error." });
    });
}
let getLink = (req, res) => {
    req.query.page = parseInt(req.query.page) || 0;
    req.query.per_page = parseInt(req.query.per_page) || 20;
    req.query.per_page = req.query.per_page > 100 ? 100 : req.query.per_page;
    database.getLinksByUid(req.query._uid, req.query.page, req.query.per_page).then((result) => {
        if (!result) {
            res.status(404).send({
                err: "id error.",
            });
        }
        else {
            let links = [];
            for (let element of result) {
                links.push({
                    uid: element._uid,
                    link: element.link,
                    linkid: element._id,
                    count: element.count,
                });
            }
            res.status(200).send(links);
        }
    }, (err) => {
        res.status(500).send({ err: "database error." });
    });
}

router.put('/link', checkLinkPurview);
router.delete('/link', checkLinkPurview);

router.post('/link', insertLink);
router.delete('/link', removeLink);
router.put('/link', updateLink);
router.get('/link', getLink);

module.exports = router;
