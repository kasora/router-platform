'use strict'

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ListStore = assign({}, EventEmitter.prototype, {
  userinfo: {},

  getUserinfo: function () {
    return this.userinfo;
  },

  signupHandler: function (userinfo) {
    this.userinfo = userinfo;
  },
  loginHandler: function (userinfo) {
    this.userinfo = userinfo;
  },
  infoHandler: function (userinfo) {
    this.userinfo = userinfo;
  },

  emitSignup: function () {
    this.emit('signup');
  },
  addSignupListener: function (callback) {
    this.on('signup', callback);
  },
  removeSignupListener: function (callback) {
    this.removeListener('signup', callback);
  },

  emitLogin: function () {
    this.emit('Login');
  },
  addLoginListener: function (callback) {
    this.on('Login', callback);
  },
  removeLoginListener: function (callback) {
    this.removeListener('Login', callback);
  },

  emitInfo: function () {
    this.emit('Info');
  },
  addInfoListener: function (callback) {
    this.on('Info', callback);
  },
  removeInfoListener: function (callback) {
    this.removeListener('Info', callback);
  },

});

module.exports = ListStore;