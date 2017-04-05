'use strict'

const React = require('react');
const { Component } = require('react');
import { render } from 'react-dom';
const { Router, Route, Link, browserHistory, IndexRoute } = require('react-router');
const ListStore = require('../stores/ListStore');
const UserActions = require('../actions/UserActions');
const request = require('../utils/http');

const PassportController = require('./PassportController');
const HomePage = require('../components/HomePage');
const ErrorBox = require('../components/ErrorBox');

class HomePageController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userinfo: ListStore.getUserinfo()
    }
  }

  componentDidMount() {
    ListStore.addSignupListener(this._onGetInfo);
    ListStore.addLoginListener(this._onGetInfo);

    if (ListStore.getUserinfo().name === undefined) {
      request.get('/api/user').then(res => {
        UserActions.getInfo(res);
      });
    }
  }

  componentWillUnmount() {
    ListStore.removeSignupListener(this._onGetInfo);
    ListStore.removeLoginListener(this._onGetInfo);
  }

  _onGetInfo = () => {
    this.setState({
      userinfo: ListStore.getUserinfo()
    });
  }

  render() {
    if (this.state.userinfo.name === undefined) {
      return (
        <div>
          <p>welcome guest.</p>
          <ul>
            <li><Link to="/passport/login">login</Link></li>
            <li><Link to="/passport/signup">sign up</Link></li>
          </ul>
        </div>
      );
    }
    else {
      return (
        <HomePage userinfo={this.state.userinfo} />
      )
    }
  }
};

module.exports = HomePageController;

