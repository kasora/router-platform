'use strict'

var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();
var ListStore = require('../stores/ListStore');

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case 'USER_LOGIN':
      ListStore.loginHandler(action.userinfo);
      ListStore.emitLogin();
      break;
    default:
      break;
  }
})

module.exports = AppDispatcher;