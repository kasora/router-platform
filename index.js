"use strict"

const mongoway = require('./dataoption/mongoway');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser')
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

let router = express.Router();
let app = express();

app.use(bodyParser());
app.use('/api', (req, res, next) => {
    res.type("json");
    next();
});
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));

//print log.  --TODO
app.use((req, res, next) => {
    if (config.log === "console") {
        console.log(`A ${req.method} request to ${req._parsedUrl.path}.`);
    }
    next();
});

//check ID for MongoDB.
app.get('/api/*', (req, res, next) => {
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
});
app.use('/api', require('./api/router'));

app.listen(config.port);
console.log(`Service started at port ${config.port}.`);
