'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';
const md5 = require('md5');
const request = require('../utils/http');

class Login extends Component {
  constructor() {
    super();
  }

  submitHandle = (event) => {
    event.preventDefault();
    let data = {
      password: md5(React.findDOMNode(this.refs.password).value),
      email: React.findDOMNode(this.refs.email).value,
      name: React.findDOMNode(this.refs.name).value,
    }
    request.post('/api/user', data).then((res) => {
      window.userInfo = res;
      console.log(window.userInfo);
    });    
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

export default Login;