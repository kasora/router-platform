'use strict'

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ListStore = assign({}, EventEmitter.prototype, {
  items: [],
  userinfo:{},

  getAll: function () {
    return this.items;
  },

  loginHandler: function (userinfo) {
    this.items.push(userinfo);
  },

  emitLogin: function(){
    this.emit('login');
  },

  addChangeListener: function (callback) {
    this.on('login', callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener('login', callback);
  }
});

module.exports = ListStore;