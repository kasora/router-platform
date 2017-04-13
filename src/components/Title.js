'use strict';

const React = require('react');
const { Component } = require('react');
const { render } = require('react-dom');
const { browserHistory, Router, Route, IndexRoute, Link } = require('react-router');

const User = require('./User');
const ListStore = require('../stores/ListStore');
require('classlist-polyfill');

class Title extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="navbar navbar-default">
        <div className="container-fluid">
          <div id="title" className="navbar-header">
            <a className="navbar-brand" href="/">Kasora Link</a>
            <User userinfo={this.props.userinfo} />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Title;
