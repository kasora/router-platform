'use strict';

const express = require('express');
const database = require('./data').database;
const config = require('../config');
const randomstring = require('randomstring');

let router = express.Router();

let addUser = (_userInfo, next) => {
  let userInfo = {
    name: _userInfo.name || 'unknown',
    email: _userInfo.email,
    password: _userInfo.password,
    purview: "user",
    checked: "true",
    emailToken: randomstring.generate(),
  }

  return database.insertUser(userInfo).then((result) => {
    return database.insertToken(result._id);
  });
}

module.exports = {
  addUser,
}
