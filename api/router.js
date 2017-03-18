'use strict'

const express = require('express');
const database = require('./data').database;
const ObjectID = require('mongodb').ObjectID;

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
    let link = req.query.link || req.body.link;
    if (!link) {
        return res.status(400).send({
            err: "Invalid link.",
        });
    }
    database.insertLink(link).then((result) => {
        res.send(result);
    });
}

let routeLink = (req, res) => {
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
    database.addCountById(req.query._id);
}

router.get('/link', getLink);
router.post('/link', insertLink);
router.get('/route', routeLink);

module.exports = router;

