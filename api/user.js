'use strict';

const express = require('express');
const database = require('./data').database;
const config = require('../config');
const randomstring = require('randomstring');

let router = express.Router();

let checkEmailChecked = (req, res, next) => {
  database.getUserByEmail(req.query.email).then((result) => {
    if (result.emailToken === req.query.emailToken) {
      database.updateUserByEmail(req.query.email, { checked: "true" }).then(() => {
        res.cookie("token", tokenInfo.token);
        next();
      }, (err) => {
        res.status(401).send({ err: "expire error." });
      });
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
let checkEmailExist = (req, res, next) => {
  database.getUserByEmail(req.query.email).then((result) => {
    if (result && (!result.checked || result.checked === "true")) {
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

let addUser = (req, res) => {
  let userInfo = {
    name: req.query.name || 'unknown',
    email: req.query.email,
    password: req.query.password,
    purview: "user",
    checked: "false",
    emailToken: randomstring.generate(),
  }

  database.insertUser(userInfo).then((result) => {
    database.insertToken(result._id).then((tokenInfo) => {
      if (req.query.remember === "true") {
        res.cookie("token", tokenInfo.token, { maxAge: config.renewTime * 86400000 });
      }
      else {
        res.cookie("token", tokenInfo.token);
      }
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
  else if (req.cookies.token != undefined) {
    database.getTokenByToken(req.cookies.token).then(tokenResult => {
      database.getUserById(tokenResult._uid).then(result => {
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
    }, (err) => {
      res.status(400).send({ err: "token error" });
    });
  }
  else {
    res.status(404).send({ err: "userinfo error." });
  }
}
let removeUser = (req, res) => {
  if (req.query.purview === "guest") {
    res.status(401).send({ err: "purview error." });
    return;
  }
  if (req.query.email !== undefined) {
    database.removeUserByEmail(req.query.email).then((result) => {
      if (req.query.purview === "owner") {
        res.clearCookie("token");
      }
      res.status(204).send({});
    }, (err) => {
      res.status(500).send({ err: "database error." });
    });
  }
  else if (req.query._removeUid !== undefined) {
    database.removeUserById(req.query._uid).then((result) => {
      if (req.query.purview === "owner") {
        res.clearCookie("token");
      }
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
  if (req.query.purview === "guest") {
    res.status(401).send({ err: "purview error." });
    return;
  }
  let userInfo = {
    name: req.query.name,
    password: req.query.password,
  }
  console.log(userInfo);
  database.updateUserByEmail(req.query.email, userInfo).then((result) => {
    database.getUserByEmail(req.query.email).then((userResult) => {
      database.getTokenByUid(userResult._id).then((tokenResult) => {
        let resText = {
          _id: userResult._id,
          email: req.query.email,
          name: userInfo.name,
          purview: userResult.purview,
          token: tokenResult.token,
          tokenDispose: tokenResult.dispose,
        }
        console.log(resText);
        res.status(201).send(resText);
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

router.post('/user', checkUserInfo);
router.post('/user', checkEmailExist);

router.post('/user', addUser);
router.delete('/user', removeUser);
router.put('/user', updateUser);
router.get('/user', getUser);

module.exports = router;
