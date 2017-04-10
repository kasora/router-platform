'use strict';

const { Component } = require('react');
const { render } = require('react-dom');

const UserActions = require('../actions/UserActions');
const ListStore = require('../stores/ListStore');
const request = require('../utils/http');
const Title = require('./Title');
const Links = require('./Links');

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Links />
      </div>
    )
  }
}

module.exports = HomePage;
