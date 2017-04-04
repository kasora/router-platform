'use strict'

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ListStore = assign({}, EventEmitter.prototype, {
  userinfo:{},

  getUserinfo: function () {
    return this.userinfo;
  },

  signupHandler: function (userinfo) {
    this.userinfo = userinfo;
  },

  emitSignup: function(){
    this.emit('signup');
  },

  addSignupListener: function (callback) {
    this.on('signup', callback);
  },

  removeSignupListener: function (callback) {
    this.removeListener('signup', callback);
  }
});

module.exports = ListStore;