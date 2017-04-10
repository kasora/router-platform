'use strict';

const Dispatcher = require('flux').Dispatcher;
const AppDispatcher = new Dispatcher();
const ListStore = require('../stores/ListStore');

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case 'USER_SIGNUP':
      ListStore.infoHandler(action.userinfo);
      ListStore.emitSignup();
      break;
    case 'USER_LOGIN':
      ListStore.infoHandler(action.userinfo);
      ListStore.emitLogin();
      break;
    case 'USER_INFO':
      ListStore.infoHandler(action.userinfo);
      ListStore.emitLogin();
      break;
    case 'USER_SIGNOUT':
      ListStore.infoHandler(action.userinfo);
      ListStore.emitSignout();
      break;
    default:
      break;
  }
})

module.exports = AppDispatcher;