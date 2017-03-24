'use strict'

const express = require('express');
const database = require('./data').database;
const ObjectID = require('mongodb').ObjectID;
const config = require('../config');
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
    let userInfo = {
        email: req.query.email,
        password: req.query.password,
    }

    database.getUserByEmail(userInfo.email).then((userResult) => {
        database.checkPassword(userInfo.email, userInfo.password).then(() => {
            database.getTokenByUid(userResult._id).then((tokenResult) => {
                database.removeToken(userResult._id).then(() => {
                    database.insertToken(userResult._id).then((newToken) => {
                        userResult.token = newToken.token;
                        userResult.tokenDispose = newToken.dispose;
                        res.type('application/json');
                        res.status(201).send(userResult);
                    });
                });
            });
        }, (err) => {
            if (err !== "database error.") {
                res.status(401).send({ err });
            }
            else {
                res.status(500).send({ err });
            }
        });
    }, (err) => {
        console.error(err);
        res.status(500).send({ err: "database error." });
    });
}

let addUser = (req, res) => {
    let userInfo = {
        name: req.query.name,
        email: req.query.email,
        password: req.query.password,
        purview: "user",
    }

    database.insertUser(userInfo).then((result) => {
        database.insertToken(result._id).then((tokenInfo) => {
            result.token = tokenInfo.token;
            result.tokenDispose = tokenInfo.dispose;
            result.purview = "user";
            res.type('application/json');
            res.status(201).send(result);
        }, (err) => {
            console.error(err);
            res.status(500).send({ err: "database error." });
        });
    }, (err) => {
        console.error(err);
        res.status(500).send({ err: "database error." });
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

let checkEmail = (req, res, next) => {
    database.getUserByEmail(req.query.email).then((result) => {
        if (result) {
            res.status(400).send({ err: 'Email is exist.' });
        }
        else {
            next();
        }
    }, (err) => {
        res.status(500).send({ err: "database error." });
    });
}

let checkToken = (req, res, next) => {
    if (!req.query.token) {
        res.status(401).send({ err: "token isn't exist." });
        return;
    }
    database.getToken(req.query.token).then((tokenResult) => {
        if (!tokenResult) {
            res.status(401).send({ err: "token isn't exist." });
            return;
        }
        let now = new Date();
        if ((now.getTime() > tokenResult.dispose) ||
            (now.getTime() - tokenResult.create > config.disposeTime * 24 * 60 * 60 * 1000)) {
            res.status(401).send({ err: "token is invalid." });
            return;
        }
        else {
            next();
        }
    }, (err) => {
        res.status(500).send({ err: "database error." });
        return;
    });
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
router.use(['/user', '/login'], (req, res, next) => {
    req.query.email = req.query.email || req.body.email;
    req.query.password = req.query.password || req.body.password;
    req.query.name = req.query.name || req.body.name;
    req.query.token = req.query.token || req.body.token;
    next();
});

// check userinfo
router.post('/user', checkEmail);
router.post(['/user', '/login'], (req, res, next) => {
    if (!req.query.email || !req.query.password) {
        res.status(400).send({
            err: "you have to provide email and password."
        });
        return;
    }
    next();
});
router.post('/user', (req, res, next) => {
    if (!req.query.name) {
        req.query.name = 'unknown';
    }
    next();
});
router.use('/link', checkToken);
router.put('/user', checkToken);
router.delete('/user', checkToken);



router.use('/user', replaceMongoId);
router.get(['/link', '/route'], replaceMongoId);
router.put('/link', replaceMongoId);
router.delete('/link', replaceMongoId);

router.get('/link', getLink);
router.post('/link', insertLink);
router.put('/link', updateLink);
router.delete('/link', removeLink);

router.post('/user', addUser);
router.post('/login', login);

router.get('/route', routeLink);

module.exports = router;

