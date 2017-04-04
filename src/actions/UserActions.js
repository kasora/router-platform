'use strict'

let AppDispatcher = require('../dispatcher/AppDispatcher');

let UserActions = {
  login: function (userinfo) {
    AppDispatcher.dispatch({
      actionType: "USER_SIGNUP",
      userinfo,
    });
  },
};

module.exports = UserActions;