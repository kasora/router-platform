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
          <div className="navbar-header">
            <a className="navbar-brand" href="/">Kasora Link</a>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <div className="navbar-collapse collapse" data-uib-collapse="!isCollapsed1" aria-expanded="false" aria-hidden="true" style={{ "height": "0px" }}>
              <User userinfo={this.props.userinfo} />
            </div>
          </ul>
        </div>
      </div>
    );
  }
}

module.exports = Title;
