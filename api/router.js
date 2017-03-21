'use strict'

const express = require('express');
const database = require('./data').database;
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

let router = express.Router();

let getLink = (req, res) => {
    database.getLinkById(req.query._id).then((result) => {
        if (!result) {
            res.status(404).send({
                err: "Invalid ID.",
            });
        }
        else {
            res.send(result);
        }
    }, (err) => {
        console.error(err);
        res.sendStatus(500);
    });
}

let insertLink = (req, res) => {
    
    if (!req.query.link) {
        return res.status(400).send({
            err: "Invalid link.",
        });
    }
    database.insertLink(req.query.link).then((result) => {
        res.status(201).send(result);
    }, (err) => {
        console.error(err);
        res.sendStatus(500);
    });
}

let updateLink = (req, res) => {
    database.updateLinkById(req.query._id, req.query.link).then((result) => {
        res.sendStatus(201);
    }, (err) => {
        console.error(err);
        res.sendStatus(500);
    });
}

let removeLink = (req, res) => {
    database.removeLinkById(req.query._id).then((result) => {
        res.sendStatus(204);
    }, (err) => {
        console.error(err);
        res.sendStatus(500);
    });
}


let login = (req, res) => {

}

let addUser = (req, res) => {
    req.query.userInfo.purview = "user";
    database.insertUser(req.query.userInfo).then((result) => {
        database.insertToken(result._id).then((tokenInfo) => {
            res.status(200).send(tokenInfo);
        });
    }, (err) => {
        console.error(err);
        res.sendStatus(500);
    });
}

let getUser = (req, res) => {
    if (!(req.query._id === undefined)) {
        database.getUserById(req.query._id).then((result) => {
            res.status(200).send({
                id: result._id,
                userInfo: {
                    name: result.userInfo.name,
                    email: result.userInfo.email,
                    purview: result.userInfo.purview,
                },
            });
        }, (err) => {
            console.error(err);
            res.sendStatus(500);
        });
    }
    else if (req.query.email) {

    }
}

let routeLink = (req, res) => {
    database.getLinkById(req.query._id).then((result) => {
        if (!result) {
            res.status(404).send({
                err: "Invalid ID.",
            });
        }
        else {
            res.type('html')
            res.send(`<script>window.location.href='${result.link}';</script>`);
        }
    });
    database.addCountById(req.query._id);
}



let replaceMongoId = (req, res, next) => {
    if (req.query.id === undefined) {
        next();
        return;
    }
    if (config.dataWay === "mongodb") {
        try {
            req.query._id = new ObjectID(req.query.id);
            next();
        } catch (err) {
            res.status(404).send({
                err: "Invalid ID.",
            });
            return;
        }
    }
    else {
        next();
    }
}



// organize params
router.use(['/link', '/route'], (req, res, next) => {
    req.query.link = req.query.link || req.body.link;
    req.query.id = req.query.id || req.body.id;


    if (req.query.link) {
        if (!/^http/.test(req.query.link))
            req.query.link = `http://` + req.query.link;
    }
    next();
})
route.use('/user', (req, res, next) => {
    req.query.userInfo = req.query.userInfo || req.body.userInfo;
    req.query.id = req.query.id || req.body.id;
});

// check userinfo
route.post('/user', (req, res, next) => {
    if (!req.query.userInfo.email || !req.query.userInfo.password) {
        res.sendStatus(400);
        return;
    }
    if (!req.query.name) {
        req.query.name = 'unknown';
    }
    next();
});


route.use('/user', replaceMongoId);
router.get(['/link', '/route'], replaceMongoId);
router.put('/link', replaceMongoId);
router.delete('/link', replaceMongoId);

router.get('/link', getLink);
router.post('/link', insertLink);
router.put('/link', updateLink);
router.delete('/link', removeLink);

route.post('/user', addUser);

router.get('/route', routeLink);

module.exports = router;

