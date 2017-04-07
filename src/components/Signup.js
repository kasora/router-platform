'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';

const UserActions = require('../actions/UserActions');
const md5 = require('md5');
const request = require('../utils/http');
const ListStore = require('../stores/ListStore');

class Signup extends Component {
  constructor(props) {
    super(props);
  }

  submitHandle = (event) => {
    event.preventDefault();
    this.userSignup();
  }

  userSignup() {
    let data = {
      password: md5(this.refs.password.value),
      email: this.refs.email.value,
      name: this.refs.name.value,
    }
    request.post('/api/user', data).then((res) => {
      UserActions.signup(res);
      browserHistory.push('/');
    });
  }

  render() {
    return (
      <div id="signup">
        <h3 style={{ "margin-top": 0 }} className="blockTitle">Sign up</h3>
        <form action="/api/user" method="post" className="form-horizontal ng-pristine ng-valid" encType="application/x-www-form-urlencoded" onSubmit={this.submitHandle}>

          <div className="form-group">
            <label for="inputPassword" className="col-lg-2 control-label">Name</label>
            <div className="col-lg-10">
              <input ref="name" name="name" type="text" className="form-control" id="inputEmail" placeholder="Name" />
            </div>
          </div>

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
              <div className="checkbox">
                <label>
                  <input type="checkbox" />Remenber me
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