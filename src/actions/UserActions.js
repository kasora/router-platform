'use strict'

let AppDispatcher = require('../dispatcher/AppDispatcher');

let UserActions = {
  signup: function (userinfo) {
    AppDispatcher.dispatch({
      actionType: "USER_SIGNUP",
      userinfo,
    });
  },
  login: function (userinfo) {
    AppDispatcher.dispatch({
      actionType: "USER_LOGIN",
      userinfo,
    });
  },
  getInfo: function (userinfo) {
    AppDispatcher.dispatch({
      actionType: "USER_INFO",
      userinfo,
    });
  },
};

module.exports = UserActions;