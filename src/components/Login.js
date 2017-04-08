'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';

const UserActions = require('../actions/UserActions');
const md5 = require('md5');
const request = require('../utils/http');
const ListStore = require('../stores/ListStore');

class Login extends Component {
  constructor() {
    super();
  }

  submitHandle = (event) => {
    event.preventDefault();
    this.userLogin();
  }

  userLogin() {
    let data = {
      password: md5(this.refs.password.value),
      email: this.refs.email.value,
    }
    request.get(`/api/login?email=${data.email}&password=${data.password}`).then((res) => {
      UserActions.login(res);
      browserHistory.push('/');
    }, (err) => {
      this.refs.password.parentNode.classList.add("has-error");
      this.refs.password.parentNode.parentNode.firstChild.innerHTML = "Password (password error.)";
    });
  }

  render() {
    return (
      <div id="login">
        <h3 style={{ "margin-top": 0 }} className="blockTitle">Login</h3>
        <form action="/api/user" method="post" className="form-horizontal ng-pristine ng-valid" encType="application/x-www-form-urlencoded" onSubmit={this.submitHandle}>

          <div className="form-group">
            <label for="inputPassword" className="col-lg-2 control-label">Email</label>
            <div className="col-lg-10">
              <input ref="email" name="email" type="email" className="form-control" id="inputEmail" placeholder="Email" />
            </div>
          </div>

          <div className="form-group">
            <label for="inputPassword" className="col-lg-2 control-label">Password</label>
            <div className="col-lg-10">
              <input ref="password" name="password" type="password" className="form-control" id="inputPassword" placeholder="Password" />
            </div>
          </div>

          <div className="form-group">
            <label for="inputPassword" className="col-lg-2 control-label"></label>
            <div className="col-lg-10">
              <div className="checkbox">
                <label>
                  <input type="checkbox" />Remember me
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="col-lg-10 col-lg-offset-2">
              <button type="reset" className="btn btn-default">Cancel</button>
              &nbsp;
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </div>

        </form>
      </div>
    )
  }
}

module.exports = Login;