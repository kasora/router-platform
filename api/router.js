'use strict'

const express = require('express');
const database = require('./data').database;
const ObjectID = require('mongodb').ObjectID;
const config = require('../config');
const fs = require('fs');

let router = express.Router();




let replaceMongoId = (req, res, next) => {
    if (req.query.uid !== undefined) {
        if (config.dataWay === "mongodb") {
            try {
                req.query._uid = new ObjectID(req.query.uid);
            } catch (err) {
                res.status(404).send({
                    err: "uid error.",
                });
                return;
            }
        }
    }
    if (req.query.linkid != undefined) {
        if (config.dataWay === "mongodb") {
            try {
                req.query._linkid = new ObjectID(req.query.linkid);
            } catch (err) {
                res.status(404).send({
                    err: "linkid error.",
                });
                return;
            }
        }
    }
    next();
}
let updateToken = (req, res, next) => {
    if (req.query.token !== undefined) {
        database.getTokenByToken(req.query.token).then((tokenResult) => {
            let now = new Date();
            if ((now.getTime() > tokenResult.dispose) ||
                (now.getTime() - tokenResult.create > config.disposeTime * 24 * 60 * 60 * 1000)) {
                res.status(401).send({ err: "token error." });
                return;
            }
            else {
                database.renewTokenByToken(req.query.token).then((result) => {
                    next();
                }, (err) => {
                    res.status(500).send({ err: "database error." })
                });
                return;
            }
        }, (err) => {
            if (err === "token error.") {
                res.status(401).send({ err });
            }
            else {
                res.status(500).send({ err: "database error." });
            }
        });
    }
    else {
        next();
    }
}
let checkEmail = (req, res, next) => {
    database.getUserByEmail(req.query.email).then((result) => {
        if (result) {
            res.status(400).send({ err: 'email error.' });
        }
    }, (err) => {
        if (err === "userinfo error.") {
            next();
        }
        else {
            res.status(500).send({ err: "database error." });
        }
    });
}
let checkToken = (req, res, next) => {
    req.query.token = req.query.token || req.body.token;
    if (!req.query.token) {
        res.status(401).send({ err: "token error." });
        return;
    }
    database.getTokenByToken(req.query.token).then((tokenResult) => {
        if (!tokenResult) {
            res.status(401).send({ err: "token error." });
        }
        req.query._uid = tokenResult._uid;
        next();
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
let checkUserPurview = (req, res, next) => {
    if (req.query.token === undefined) {
        res.status(401).send({ err: "purview error." });
        return;
    }
    database.getTokenByToken(req.query.token).then((tokenResult) => {
        database.getUserById(tokenResult._uid).then((result) => {
            if (result.purview === "admin") {
                req.query.purview = "admin";
                next();
            }
            else if (result.email === req.query.email) {
                req.query.purview = "owner";
                next();
            }
            else {
                res.status(401).send({ err: "token error." });
            }
        }, (err) => {
            if (err === "user error.") {
                res.status(401).send({ err: "token error." });
            }
            else {
                res.status(500).send({ err: "database error." });
            }
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
let checkLinkPurview = (req, res, next) => {
    if (req.query.token === undefined) {
        res.status(401).send({ err: "purview error." });
        return;
    }
    database.getTokenByToken(req.query.token).then((tokenResult) => {
        database.getUserById(tokenResult._uid).then((result) => {
            if (result.purview === "admin") {
                req.query.purview = "admin";
                next();
                return;
            }
            database.getLinkById(req.query._linkid).then((linkResult) => {
                if (linkResult._uid.toString() === tokenResult._uid.toString()) {
                    req.query.purview = "owner";
                    next();
                    return;
                }
                else {
                    res.status(401).send({ err: "token error." });
                }
            }, (err) => {
                if (err === "user error.") {
                    res.status(401).send({ err: "token error." });
                }
                else {
                    res.status(500).send({ err: "database error." });
                }
            });
        }, (err) => {
            if (err === "user error.") {
                res.status(401).send({ err: "token error." });
            }
            else {
                res.status(500).send({ err: "database error." });
            }
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
            err: "link error.",
        });
    }
    database.insertLink(req.query.link, req.query._uid).then((result) => {
        res.status(201).send({
            uid: req.query._uid,
            linkid: result._id,
            link: req.query.link,
            count: 0,
        });
    }, (err) => {
        res.sendStatus(500);
    });
}
let removeLink = (req, res) => {
    database.removeLinkById(req.query._linkid).then((result) => {
        res.status(204).send({});
    }, (err) => {
        res.status(500).send({ err: "database error." });
    });
}
let updateLink = (req, res) => {
    database.getLinkById(req.query._linkid).then((linkResult) => {
        database.updateLinkById(req.query._linkid, req.query.newlink).then((result) => {
            res.status(201).send(linkResult);
        });
    }, (err) => {
        res.status(500).send({ err: "database error." });
    });
}
let getLink = (req, res) => {
    req.query.page = parseInt(req.query.page) || 0;
    req.query.per_page = parseInt(req.query.per_page) || 20;
    req.query.per_page = req.query.per_page > 100 ? 100 : req.query.per_page;
    database.getLinksByUid(req.query._uid, req.query.page, req.query.per_page).then((result) => {
        if (!result) {
            res.status(404).send({
                err: "id error.",
            });
        }
        else {
            let links = [];
            for (let element of result) {
                links.push({
                    uid: element._uid,
                    link: element.link,
                    linkid: element._id,
                    count: element.count,
                });
            }
            res.status(200).send(links);
        }
    }, (err) => {
        res.status(500).send({ err: "database error." });
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
                res.cookie("token",newToken.token,{maxAge:config.renewTime*86400000});
                userResult.token = newToken.token;
                userResult.tokenDispose = newToken.dispose;
                res.type('application/json');
                res.status(201).send(userResult);
            });
        });
    }, (err) => {
        if (err === "userinfo error.") {
            res.status(401).send({ err });
        }
        else {
            res.status(500).send({ err: "database error." });
        }
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
            res.cookie("token",newToken.token,{maxAge:config.renewTime*86400000});
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
    if (req.query._uid !== undefined) {
        database.getUserById(req.query._uid).then((result) => {
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
            if (err === "userinfo error.") {
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
    if (req.query._uid !== undefined) {
        database.removeUserById(req.query._uid).then((result) => {
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
        }, (err) => {
            if (err === "userinfo error.") {
                res.status(401).send({ err });
            }
            else {
                res.status(500).send({ err: "database error." });
            }
        });
    });
}




let routeLink = (req, res) => {
    database.getLinkById(req.query._id).then((result) => {
        if (!result) {
            res.status(404).send({ err: "id error." });
            return;
        }
        else {
            res.type('html')
            res.send(`<script>window.location.href='${result.link}';</script>`);
            database.addCountById(req.query._id);
        }
    }, (err) => {
        res.status(500).send({ err: "database error." });
        return;
    });
    
}




// organize params
router.use(['/link', '/route'], (req, res, next) => {
    req.query.link = req.query.link || req.body.link;
    req.query.uid = req.query.uid || req.body.uid;
    req.query.linkid = req.query.linkid || req.body.linkid;
    req.query.page = req.query.page || req.body.page;
    req.query.per_page = req.query.per_page || req.body.per_page;

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
    next();
});

router.use(replaceMongoId);
router.use(updateToken);

router.post('/user', checkUserInfo);
router.post('/user', (req, res, next) => {
    if (!req.query.name) {
        req.query.name = 'unknown';
    }
    next();
});
router.post('/user', checkEmail);
router.delete('/user', checkUserPurview);
router.put('/user', checkUserPurview);

router.get('login', checkUserInfo)
router.get('/login', checkPassword);

router.use('/link', checkToken);
router.put('/link', checkLinkPurview);
router.delete('/link', checkLinkPurview);


router.post('/link', insertLink);
router.delete('/link', removeLink);
router.put('/link', updateLink);
router.get('/link', getLink);

router.post('/user', addUser);
router.delete('/user', removeUser);
router.put('/user', updateUser);
router.get('/user', getUser);

router.get('/login', login);

router.get('/route', routeLink);


module.exports = router;

