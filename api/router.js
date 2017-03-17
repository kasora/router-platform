'use strict'

const express = require('express');
const database = require('./data').database;
const ObjectID = require('mongodb').ObjectID;

let router = express.Router();

let getLink = (req, res) => {
    database.getLinkById(new ObjectID(req.query.id)).then((result) => {
        if (result == null) { res.sendStatus(404); }
        else { res.send(result); }
    });
}

let insertLink = (req, res) => {
    let link = req.query.link || req.body.link;
    if (!link) { return res.sendStatus(400); }
    database.insertLink(link).then((result) => {
        res.send(result);
    });
}

router.get('/link', getLink);
router.post('/link', insertLink);

module.exports = router;

