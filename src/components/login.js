'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import request from '../utils/http';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';
import md5 from 'md5';

class Login extends Component {
  constructor() {
    super();
  }

  submitHandle = (event) => {
    this.refs.password.value = md5(React.findDOMNode(this.refs.password).value);
  }

  render() {
    return (
      <div id="login">
        <h3 className="blockTitle">Login</h3>
        <form action="/api/user" method="post" encType="application/x-www-form-urlencoded" onSubmit={this.submitHandle}>

          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input name="email" type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" />
          </div>

          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input ref="password" name="password" type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>

          <button type="submit" className="btn btn-default">Submit</button>

        </form>
      </div>
    )
  }
}

export default Login;