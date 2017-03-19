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
app.use('/api/link', (req, res, next) => {
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


app.use('/api', require('./api/router'));

app.use('/api/route', (req, res, next) => {

})

app.listen(config.port);
console.log(`Service started at port ${config.port}.`);
