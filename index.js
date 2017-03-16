"use strict"

const mongoway = require('./api/mongoway');
const config = require('./config');
const express = require('express');

let router = express.Router();
let app = express();

app.use(bodyParser());

app.use('/api', async (res,req, next) => {
    ctx.type = "application/json";
    await next();
});




app.listen(config.port);
console.log(`Service started at port ${config.port}.`);
