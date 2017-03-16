'use strict'

const config = require('../config');

config.dataWay = config.dataWay || "mongodb";

let operate = null;

if(config.operate === "mongodb"){
    operate = require('../dataoption/mongoway');
}
else if(config.operate === "mysql"){
    operate = require('../dataoption/mysqlway');
}
else{
    operate = require('../dataoption/textway');
}



