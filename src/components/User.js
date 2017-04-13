'use strict';

const React = require('react');
const { Component } = require('react');
const { render } = require('react-dom');
const { Router, Route, Link, browserHistory, IndexRoute, IndexRedirect } = require('react-router');
const UserActions = require('../actions/UserActions');
const request = require('../utils/http');

require('classlist-polyfill');

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }

    this.clickHandle = this.clickHandle.bind(this);
    this.signout = this.signout.bind(this);
  }

  clickHandle(event) {

    event.preventDefault();
    let div = event.target.parentNode;
    if (this.state.open) {
      div.classList.remove("open");
      this.setState({ open: false });
    }
    else {
      div.classList.add("open");
      this.setState({ open: true });
    }
  }

  signout(event) {
    request.delete('/api/login').then(() => {
      UserActions.signout({
        name: "guest",
      });
    });
  }

  render() {
    if (this.props.userinfo.name === "guest") {
      return (
        <div id="user" data-uib-dropdown="" style={{ display: "inline-block" }} className="dropdown">
          <ul className="nav navbar-nav">
            <li className="dropdown">
              <a onClick={this.clickHandle} href="" data-uib-dropdown-toggle="" class="dropdown-toggle" aria-haspopup="true" aria-expanded={this.state.open}>
                {this.props.userinfo.name || "guest"}
                <span className="caret"></span>
              </a>
              <ul className="dropdown-menu" data-uib-dropdown-menu="">
                <li><a href="/passport/login">Login</a></li>
                <li><a href="/passport/signup">Sign up</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    }
    else {
      return (
        <div id="user" data-uib-dropdown="" style={{ display: "inline-block" }} className="dropdown">
          <ul className="nav navbar-nav">
            <li className="dropdown">
              <a onClick={this.clickHandle} href="" data-uib-dropdown-toggle="" class="dropdown-toggle" aria-haspopup="true" aria-expanded={this.state.open}>
                {this.props.userinfo.name || "guest"}
                <span className="caret"></span>
              </a>
              <ul className="dropdown-menu" data-uib-dropdown-menu="">
                <li><a href="/" onClick={this.signout}>Sign out</a></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    }
  }
}

module.exports = User;
