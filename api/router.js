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
    let userInfo = {
        name: req.query.name,
        email: req.query.email,
        password: req.query.password,
        purview: "user",
    }

    database.insertUser(userInfo).then((result) => {
        return database.insertToken(result._id).then((tokenInfo) => {
            result.token = tokenInfo.token;
            result.tokenDispose = tokenInfo.dispose;
            res.type('application/json');
            res.status(201).send(result);
        }, (err) => {
            console.error(err);
            res.sendStatus(500);
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
router.use('/user', (req, res, next) => {
    req.query.email = req.query.email || req.body.email;
    req.query.password = req.query.password || req.body.password;
    req.query.name = req.query.name || req.body.name;
    req.query.token = req.query.token || req.body.token;
    next();
});

// check userinfo
router.post('/user', (req, res, next) => {
    if (!req.query.email || !req.query.password) {
        res.sendStatus(400);
        return;
    }
    if (!req.query.name) {
        req.query.name = 'unknown';
    }
    next();
});


router.use('/user', replaceMongoId);
router.get(['/link', '/route'], replaceMongoId);
router.put('/link', replaceMongoId);
router.delete('/link', replaceMongoId);

router.get('/link', getLink);
router.post('/link', insertLink);
router.put('/link', updateLink);
router.delete('/link', removeLink);

router.post('/user', addUser);

router.get('/route', routeLink);

module.exports = router;

