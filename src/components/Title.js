'use strict'

const React = require('react');
const { Component } = require('react');
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute, IndexRedirect } from 'react-router';
require('classlist-polyfill');
const User = require('./User');
const ListStore = require('../stores/ListStore');

class Title extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">Kasora Link</a>
        </div>
        <ul className="nav navbar-nav navbar-right">
          <div className="navbar-collapse collapse" data-uib-collapse="!isCollapsed1" aria-expanded="false" aria-hidden="true" style={{ "height": "0px" }}>
            <User userinfo={this.props.userinfo} />
          </div>
        </ul>
      </div>
    );
  }
}

module.exports = Title;
