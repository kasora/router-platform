"use strict"

const mongoway = require('./dataoption/mongoway');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser')
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');
const path = require('path');

let router = express.Router();
let app = express();

app.use('/checkService', (req, res) => {
    res.sendStatus(200);
})

//print log.  --TODO
app.use((req, res, next) => {
    if (config.log === "console") {
        console.log(`A ${req.method} request to ${req._parsedUrl.path}.`);
    }
    next();
});

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));

app.use(express.static(__dirname + '/static'));

app.use('/api/link', (req, res, next) => {
    res.type("json");
    next();
});
app.use('/api', require('./api/router'));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'static', 'index.html'));
})

app.listen(config.port);
console.log(`Service started at port ${config.port}.`);
