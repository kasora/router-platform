'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';

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
