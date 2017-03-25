'use strict'

const express = require('express');
const database = require('./data').database;
const ObjectID = require('mongodb').ObjectID;
const config = require('../config');
const fs = require('fs');

let router = express.Router();




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
            res.status(400).send({ err: 'userinfo error.' });
        }
    }, (err) => {
        if (err === "user error.") {
            next();
        }
        else {
            res.status(500).send({ err: "database error." });
        }
    });
}
let checkToken = (req, res, next) => {
    if (!req.query.token) {
        res.status(401).send({ err: "token error." });
        return;
    }
    database.getTokenByToken(req.query.token).then((tokenResult) => {
        if (!tokenResult) {
            res.status(401).send({ err: "token error." });
            return;
        }
        let now = new Date();
        if ((now.getTime() > tokenResult.dispose) ||
            (now.getTime() - tokenResult.create > config.disposeTime * 24 * 60 * 60 * 1000)) {
            res.status(401).send({ err: "token error." });
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
let checkAdmin = (req, res, next) => {
    if (req.query.token === undefined) {
        res.status(401).send({ err: "purview error." });
        return;
    }
    database.getTokenByToken(req.query.token).then((result) => {
        database.getUserById(result._uid).then((result) => {
            if (result.purview === "admin") {
                next();
            }
            else {
                res.status(401).send({ err: "purview error." });
            }
        });
    }, (err) => {
        if (err === "token error.") {
            res.status(401).send({ err });
        }
    });
}
let checkPassword = (req, res, next) => {
    database.getPasswordByEmail(req.query.email).then((password) => {
        if (req.query.password === password) {
            next();
        }
        else {
            res.status(401).send({ err: "password error." });
        }
    }, (err) => {
        if (err === "userinfo error.") {
            res.status(401).send({ err });
        }
        else {
            res.status(500).send({ err: "database error." });
        }
    });
}
let checkUserInfo = (req, res, next) => {
    if (!req.query.email || !req.query.password) {
        res.status(400).send({
            err: "userinfo error."
        });
        return;
    }
    next();
}
let checkPrivate = (req, res, next) => {
    if (req.query.token === undefined) {
        res.status(401).send({ err: "purview error." });
        return;
    }
    database.getTokenByToken(req.query.token).then((result) => {
        database.getUserById(result._uid).then((result) => {
            if (result.purview === "admin") {
                next();
            }
            else {
                if (result.email === req.query.email) {
                    next();
                }
                else {
                    res.status(401).send({ err: "token error." });
                }
            }
        }, (err) => {
            res.status(500).send({ err: "database error." });
        });
    }, (err) => {
        if (err === "token error.") {
            res.status(401).send({ err });
        }
        else {
            res.status(500).send({ err: "database error." })
        }
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
        res.sendStatus(500);
    });
}
let removeLink = (req, res) => {
    database.removeLinkById(req.query._id).then((result) => {
        res.sendStatus(204);
    }, (err) => {
        res.sendStatus(500);
    });
}
let updateLink = (req, res) => {
    database.updateLinkById(req.query._id, req.query.link).then((result) => {
        res.sendStatus(201);
    }, (err) => {
        res.sendStatus(500);
    });
}
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
        res.sendStatus(500);
    });
}




let login = (req, res) => {
    let userInfo = {
        email: req.query.email,
        password: req.query.password,
    }

    database.getUserByEmail(userInfo.email).then((userResult) => {
        database.removeToken(userResult._id).then(() => {
            database.insertToken(userResult._id).then((newToken) => {
                userResult.token = newToken.token;
                userResult.tokenDispose = newToken.dispose;
                res.type('application/json');
                res.status(201).send(userResult);
            });
        });
    }, (err) => {
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
            res.status(500).send({ err: "database error." });
        });
    }, (err) => {
        res.status(500).send({ err: "database error." });
    });
}
let getUser = (req, res) => {
    if (req.query._id !== undefined) {
        database.getUserById(req.query._id).then((result) => {
            res.status(200).send({
                _id: result._id,
                name: result.name,
                email: result.email,
                purview: result.purview,
            });
        }, (err) => {
            if (err === "user error.") {
                res.status(404).send({ err });
            }
            else {
                res.status(500).send({ err: "database error." });
            }
        });
    }
    else if (req.query.email !== undefined) {
        database.getUserByEmail(req.query.email).then((result) => {
            res.status(200).send({
                _id: result._id,
                name: result.name,
                email: result.email,
                purview: result.purview,
            });
        }, (err) => {
            if (err === "user error.") {
                res.status(404).send({ err });
            }
            else {
                res.status(500).send({ err: "database error." });
            }
        });
    }
    else {
        res.status(404).send({ err: "userinfo error." });
    }
}
let removeUser = (req, res) => {
    if (req.query._id !== undefined) {
        database.removeUserById(req.query._id).then((result) => {
            res.status(204).send({});
        }, (err) => {
            res.status(500).send({ err: "database error." });
        });
    }
    else if (req.query.email !== undefined) {
        database.removeUserByEmail(req.query.email).then((result) => {
            res.status(204).send({});
        }, (err) => {
            res.status(500).send({ err: "database error." });
        });
    }
    else {
        res.status(404).send({ err: "userinfo error." });
    }
}
let updateUser = (req, res) => {
    let userInfo = {
        name: req.query.name,
        password: req.query.password,
    }
    database.updateUserByEmail(req.query.email, userInfo).then((result) => {
        database.getUserByEmail(req.query.email).then((userResult) => {
            database.getTokenByUid(userResult._id).then((tokenResult) => {
                res.status(201).send({
                    _id: userResult._id,
                    email: req.query.email,
                    name: userInfo.name,
                    purview: userResult.purview,
                    token: tokenResult.token,
                    tokenDispose: tokenResult.dispose,
                });
            });
        });
    });
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
router.post('/user', checkUserInfo);
router.get('login', checkUserInfo)
router.post('/user', (req, res, next) => {
    if (!req.query.name) {
        req.query.name = 'unknown';
    }
    next();
});

router.put('/user', checkPrivate);
router.delete('/user',checkPrivate);

router.post('/user', checkEmail);
router.get('/login', checkPassword);


router.put('/user', checkToken);
router.delete('/user', checkToken);
router.use('/link', checkToken);

//replace to mongoid
router.use('/user', replaceMongoId);
router.get(['/link', '/route'], replaceMongoId);
router.put('/link', replaceMongoId);
router.delete('/link', replaceMongoId);


router.get('/link', getLink);
router.post('/link', insertLink);
router.put('/link', updateLink);
router.delete('/link', removeLink);

router.get('/login', login);

router.post('/user', addUser);
router.delete('/user', removeUser);
router.put('/user', updateUser);
router.get('/user', getUser);

router.get('/route', routeLink);

module.exports = router;

