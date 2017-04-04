'use strict'

var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();
var ListStore = require('../stores/ListStore');

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case 'USER_SIGNUP':
      ListStore.signupHandler(action.userinfo);
      ListStore.emitSignup();
      break;
    default:
      break;
  }
})

module.exports = AppDispatcher;