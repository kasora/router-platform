'use strict'

const mongoway = require("../../dataoption/mongoway");
const assert = require("assert");
const config = require("../../config");
let MongoClient = require('mongodb').MongoClient;


describe('check MongoDB.', function () {
    let id = null;

    beforeEach(function (done) {
        mongoway.insertLink("testlink.com").then((result) => {
            id = result.ops[0]._id;
            done();
        });
    });

    it('find link.', function () {
        assert.ok(id);
        return mongoway.findLinkById(id).then((result) => {
            assert.ok(result.link);
        });
    });

    it('remove link.', function () {
        assert.ok(id);
        return mongoway.removeLinkById(id).then((result) => {
            assert.equal(null, result.link);
        });
    });
});
