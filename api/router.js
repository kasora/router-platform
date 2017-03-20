'use strict'

const express = require('express');
const database = require('./data').database;
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

let router = express.Router();

let getLink = (req, res) => {
    database.getLinkById(req.query._id).then((result) => {
        if (!result) {
            res.status(404).send({
                err: "Invalid ID.",
            });
        }
        else {
            res.send(result);
        }
    });
}

let insertLink = (req, res) => {
    if (!req.query.link) {
        return res.status(400).send({
            err: "Invalid link.",
        });
    }
    database.insertLink(req.query.link).then((result) => {
        res.send(result);
    });
}

let updateLink = (req, res) => {
    database.updateLinkById(req.query._id, req.query.link).then((result) => {
        res.sendStatus(200);
    });
}

let removeLink = (req, res) => {
    database.removeLinkById(req.query._id).then((result) => {
        res.sendStatus(200);
    });
}


let addUser = (req, res) => {
    database.insertUser(req.query.userInfo).then((result) => {
        res.status(200).send(result);
    });
}

let getUser = (req, res) => {
    if (req.query._id) {
        database.getUserById(req.query._id).then((result) => {
            
        });
    }
}

let routeLink = (req, res) => {
    database.getLinkById(req.query._id).then((result) => {
        if (!result) {
            res.status(404).send({
                err: "Invalid ID.",
            });
        }
        else {
            res.type('html')
            res.send(`<script>window.location.href='${result.link}';</script>`);
        }
    });
    database.addCountById(req.query._id);
}



let replaceMongoId = (req, res, next) => {
    if (config.dataWay === "mongodb") {
        try {
            req.query._id = new ObjectID(req.query.id);
            next();
        } catch (err) {
            res.status(404).send({
                err: "Invalid ID.",
            });
            return;
        }
    }
    else {
        next();
    }
}



// organize params
router.use(['/link', '/route'], (req, res, next) => {
    req.query.link = req.query.link || req.body.link;
    req.query.id = req.query.id || req.body.id;


    if (req.query.link) {
        if (!/^http/.test(req.query.link))
            req.query.link = `http://` + req.query.link;
    }
    next();
})
router.get(['/link', '/route'], replaceMongoId);
router.put('/link', replaceMongoId);
router.delete('/link', replaceMongoId);

router.get('/link', getLink);
router.post('/link', insertLink);
router.put('/link', updateLink);
router.delete('/link', removeLink);

router.get('/route', routeLink);

module.exports = router;

