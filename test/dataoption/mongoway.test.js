'use strict'

const mongoway = require("../../dataoption/mongoway");
const assert = require("assert");
const config = require("../../config");
let MongoClient = require('mongodb').MongoClient;


describe('check MongoDB.', function () {
    let id = null;
    beforeEach(function (done) {
        assert.equal(null, id);
        mongoway.insertLink("testlink.com").then((result) => {
            id = result.ops[0]._id;
            done();
        });
    });

    it('get link.', function () {
        assert.ok(id);
        return mongoway.getLinkById(id).then((result) => {
            assert.equal(result.link, "testlink.com");
        });
    });

    it('updata link.', function () {
        assert.ok(id);
        return mongoway.updateLinkById(id, "updatalink.com").then((result) => {
            return mongoway.getLinkById(id).then(doc => {
                assert.equal(doc.link, "updatalink.com");
            });
        });
    });

    it('count test.', function () {
        assert.ok(id);
        return mongoway.setCountById(id, 20).then(() => {
            return mongoway.getCountById(id).then((result)=>{
                assert.equal(20,result.count);
            });
        }).then(()=>{
            return mongoway.addCountById(id).then(()=>{
                return mongoway.getCountById(id).then((result)=>{
                    assert.equal(21,result.count);
                });
            });
        });
    });

    afterEach(function () {
        assert.ok(id);
        return mongoway.removeLinkById(id).then(() => {
            return mongoway.getLinkById(id).then((result)=>{
                id = null;
                assert.equal(null,result);
            });
        });
    });
});
