'use strict'

const express = require('express');
const database = require('./data').database;
const config = require('../config');
const randomstring = require('randomstring');

let router = express.Router();

let routeLink = (req, res) => {
    database.getLinkById(req.query._linkid).then((result) => {
        if (!result) {
            res.status(404).send({ err: "id error." });
            return;
        }
        else {
            res.type('html')
            res.send(`<script>window.location.href='${result.link}';</script>`);
            database.addCountById(req.query._linkid);
        }
    }, (err) => {
        res.status(500).send({ err: "database error." });
        return;
    });

}

router.get('/route', routeLink);

module.exports = router;
