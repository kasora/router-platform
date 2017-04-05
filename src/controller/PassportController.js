'use strict'

const React = require('react');
const { Component } = require('react');
import { render } from 'react-dom';
const { Router, Route, Link, browserHistory, IndexRoute } = require('react-router');

const Signup = require('../components/Signup');
const Login = require('../components/Login');

class PassportController extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.params.action);
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
