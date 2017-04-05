'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';

const UserActions = require('../actions/UserActions');
const ListStore = require('../stores/ListStore');
const request = require('../utils/http');
const User = require('./User');
const Links = require('./Links');

class HomePage extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <User username={this.props.userinfo.name} />
        <Links />
      </div>
    )
  }
}

module.exports = HomePage;
