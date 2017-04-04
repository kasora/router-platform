'use strict'

const React = require('react');
const { Component } = require('react');
const ReactDOM = require('react-dom');
const UserActions = require('../actions/UserActions');
const ListStore = require('../stores/ListStore');
const md5 = require('md5');
const request = require('../utils/http');

const Signup = require('../components/Signup');

class HomePageController extends Component {
  getInitialState = () => {
    return {
      userinfo: ListStore.getUserinfo()
    };
  }

  componentDidMount = () => {
    ListStore.addSignupListener(this._onSignup);
  }

  componentWillUnmount = () => {
    ListStore.removeSignupListener(this._onSignup);
  }

  _onSignup = () => {
    this.setState({
      items: ListStore.getUserinfo()
    });
  }

  userSignup() {
    let data = {
      password: md5(this.refs.password.value),
      email: this.refs.email.value,
      name: this.refs.name.value,
    }
    request.post('/api/user', data).then((res) => {
      UserActions.login(res);
    });
  }


  render = () => {
    return (
      <Router history={browserHistory}>
        <Signup onSubmit={this.userSignup} />
      </Router>
    )
  }

};

module.exports = HomePageController;