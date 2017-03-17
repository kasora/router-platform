'use strict'

const config = require('../config');

config.dataWay = config.dataWay || "mongodb";

let data = null;
if (config.dataWay === "mongodb") {
    data = require('../dataoption/mongoway');
}
else if (config.dataWay === "mysql") {
    data = require('../dataoption/mysqlway');
}
else {
    data = require('../dataoption/textway');
}


module.exports = {
    database: data,
}

