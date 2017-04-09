'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';

const UserActions = require('../actions/UserActions');
const md5 = require('md5');
const request = require('../utils/http');
const ListStore = require('../stores/ListStore');
require('classlist-polyfill');

class Signup extends Component {
  constructor(props) {
    super(props);
  }

  submitHandle = (event) => {
    event.preventDefault();
    this.userSignup();
  }

  resetClass = (event) => {
    let component = event.target;
    component.parentNode.classList.remove("has-error");
    component.setAttribute("placeholder", component.parentNode.parentNode.firstChild.innerHTML);
  }

  userSignup() {
    let data = {
      password: md5(this.refs.password.value),
      email: this.refs.email.value,
      name: this.refs.name.value,
      remember: this.refs.remember.checked,
    }
    if (data.name !== "guest") {
      request.post('/api/user', data).then((res) => {
        UserActions.signup(res);
        browserHistory.push('/');
      }, (err) => {
        this.refs.email.value = "";
        this.refs.email.parentNode.classList.add("has-error");
        this.refs.email.setAttribute("placeholder", "Email is exist, sorry.");
      });
    }
    else {
      this.refs.name.value = "";
      this.refs.name.parentNode.classList.add("has-error");
      this.refs.name.setAttribute("placeholder", "select another name, please.");
    }
  }

  render() {
    return (
      <div id="signup">
        <h3 style={{ "margin-top": 0 }} className="blockTitle">Sign up</h3>
        <form action="/api/user" method="post" className="form-horizontal ng-pristine ng-valid" encType="application/x-www-form-urlencoded" onSubmit={this.submitHandle}>

          <div className="form-group">
            <label for="inputPassword" className="col-lg-2 control-label">Name</label>
            <div className="col-lg-10">
              <input ref="name" name="name" type="text" className="form-control" onChange={this.resetClass} id="inputEmail" placeholder="Name" />
            </div>
          </div>

          <div className="form-group">
            <label for="inputPassword" className="col-lg-2 control-label">Email</label>
            <div className="col-lg-10">
              <input ref="email" name="email" type="email" className="form-control" onChange={this.resetClass} id="inputEmail" placeholder="Email" />
            </div>
          </div>

          <div className="form-group">
            <label for="inputPassword" className="col-lg-2 control-label">Password</label>
            <div className="col-lg-10">
              <input ref="password" name="password" type="password" className="form-control" onChange={this.resetClass} id="inputPassword" placeholder="Password" />
            </div>
          </div>

          <div className="form-group">
            <label for="inputPassword" className="col-lg-2 control-label"></label>
            <div className="col-lg-10">
              <div className="checkbox">
                <label>
                  <input ref="remember" type="checkbox" />Remember me
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

module.exports = Signup;