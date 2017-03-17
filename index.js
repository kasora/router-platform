"use strict"

const mongoway = require('./dataoption/mongoway');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');

let router = express.Router();
let app = express();

app.use(bodyParser());

app.use('/api', (req, res, next) => {
    res.type("application/json");
    next();
});

app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.text({ type: 'text/html' }))

app.use('/api', require('./api/router'));

app.listen(config.port);
console.log(`Service started at port ${config.port}.`);
