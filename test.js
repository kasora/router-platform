
const mongoway = require("./dataoption/mongoway");
const assert = require("assert");
const config = require("./config");
let MongoClient = require('mongodb').MongoClient;

mongoway.insertLink("testlink.com").then((result) => {
    return result.ops[0]._id;
}).then((id) => {
    console.log(id);
    return mongoway.findLinkById(id).then((result) => {
        console.log(result.link);
    });
});
