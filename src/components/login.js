'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import request from '../utils/http';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';

class Login extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <h3 className="blockTitle">Links</h3>
      </div>
    )
  }
}

export default Login;