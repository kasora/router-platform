'use strict'

let AppDispatcher = require('../dispatcher/AppDispatcher');

let ButtonActions = {
  addNewItem: function (userinfo) {
    AppDispatcher.dispatch({
      actionType: "USER_LOGIN",
      userinfo,
    });
  },
};

module.exports = ButtonActions;