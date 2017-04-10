'use strict';

const React = require('react');
const { Component } = require('react');
const { render } = require('react-dom');
const { browserHistory, Router, Route, IndexRoute, Link } = require('react-router');

const Signup = require('../components/Signup');
const Login = require('../components/Login');

class PassportController extends Component {
  constructor(props) {
    super(props);
  }

  render() {    
    if (this.props.params.action === "login") {
      return (
        <Login />
      );
    }
    if (this.props.params.action === "signup") {
      return (
        <Signup />
      );
    }
  }
}

module.exports = PassportController;
