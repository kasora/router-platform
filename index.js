"use strict"

const mongoway = require('./api/mongoway');
const Koa = require('koa');
const config = require('./config');
const bodyParser = require('koa-bodyparser');
const handlers = require('./handler');

const router = require('koa-router')();
const app = new Koa();

app.use(bodyParser());

app.use('/api', async (ctx, next) => {
    ctx.type = "application/json";
    await next();
});

app.use(handlers());


app.listen(config.port);
console.log(`Service started at port ${config.port}.`);
