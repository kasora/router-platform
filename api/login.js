'use strict';

const express = require('express');
const database = require('./data').database;
const config = require('../config');
const randomstring = require('randomstring');

let router = express.Router();

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

let login = (req, res) => {
    let userInfo = {
        email: req.query.email,
        password: req.query.password,
    }

    database.getUserByEmail(userInfo.email).then((userResult) => {
        if (userResult.checked === "false") {
            res.status(401).send({ err: "email error." });
            return;
        }
        database.removeToken(userResult._id).then(() => {
            database.insertToken(userResult._id).then((newToken) => {
                if (req.query.remember === "true") {
                    res.cookie("token", newToken.token, { maxAge: config.renewTime * 86400000 });
                }
                else {
                    res.cookie("token", newToken.token);
                }
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
let logout = (req, res) => {
    res.clearCookie("token");
    res.type('application/json');
    res.status(204).send({});
}

router.get('login', checkUserInfo);
router.get('/login', checkPassword);

router.get('/login', login);
router.delete('/login', logout);

module.exports = router;
