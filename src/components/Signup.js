'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';

class Signup extends Component {
  constructor() {
    super();
  }

  submitHandle = (event) => {
    event.preventDefault();
    this.props.onSubmit.call(this);
  }

  render() {
    return (
      <div id="login">
        <h3 className="blockTitle">Login</h3>
        <form action="/api/user" method="post" encType="application/x-www-form-urlencoded" onSubmit={this.submitHandle}>

          <div className="form-group">
            <label for="exampleInputEmail1">User name</label>
            <input ref="name" name="name" type="text" className="form-control" id="inputName" placeholder="Name" />
          </div>

          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input ref="email" name="email" type="email" className="form-control" id="inputEmail" placeholder="Email" />
          </div>

          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input ref="password" name="password" type="password" className="form-control" id="inputPassword" placeholder="Password" />
          </div>

          <button type="submit" className="btn btn-default">Submit</button>

        </form>
      </div>
    )
  }
}

module.exports = Signup;