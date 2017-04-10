'use strict'

const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');

var ListStore = assign({}, EventEmitter.prototype, {
  userinfo: {
    name:"guest",
  },

  getUserinfo: function () {
    return this.userinfo;
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
    this.emit('login');
  },
  addLoginListener: function (callback) {
    this.on('login', callback);
  },
  removeLoginListener: function (callback) {
    this.removeListener('login', callback);
  },

  emitInfo: function () {
    this.emit('info');
  },
  addInfoListener: function (callback) {
    this.on('info', callback);
  },
  removeInfoListener: function (callback) {
    this.removeListener('info', callback);
  },

  emitSignout: function () {
    this.emit('signout');
  },
  addSignoutListener: function (callback) {
    this.on('signout', callback);
  },
  removeSignoutListener: function (callback) {
    this.removeListener('signout', callback);
  },

});

module.exports = ListStore;