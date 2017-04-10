'use strict';

const { Component } = require('react');
const { render } = require('react-dom');
const { browserHistory, Router, Route, IndexRoute, Link } = require('react-router');
const ListStore = require('../stores/ListStore');
const UserActions = require('../actions/UserActions');
const request = require('../utils/http');

const PassportController = require('./PassportController');
const HomePage = require('../components/HomePage');
const ErrorBox = require('../components/ErrorBox');
const Title = require('../components/Title');

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
    ListStore.addSignoutListener(this._onGetInfo);

    if (ListStore.getUserinfo().name === "guest") {
      request.get('/api/user').then(res => {
        UserActions.getInfo(res);
      },(err)=>{
        
      });
    }
  }

  componentWillUnmount() {
    ListStore.removeSignupListener(this._onGetInfo);
    ListStore.removeLoginListener(this._onGetInfo);
    ListStore.removeSignoutListener(this._onGetInfo);
  }

  _onGetInfo = () => {
    this.setState({
      userinfo: ListStore.getUserinfo()
    });
  }

  render() {
    if (this.state.userinfo.name === "guest") {
      return (
        <div>
          <Title userinfo={this.state.userinfo} />
          <Router history={browserHistory}>
            <Route path='/passport/:action' component={PassportController} />
          </Router>
        </div>
      );
    }
    else {
      return (
        <div>
          <Title userinfo={this.state.userinfo} />
          <HomePage userinfo={this.state.userinfo} />
        </div>
      )
    }
  }
}

module.exports = HomePageController;

