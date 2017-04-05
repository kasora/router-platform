'use strict'

const React = require('react');
const { Component } = require('react');
import { render } from 'react-dom';

class User extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <div>{this.props.username}</div>
    );
  }
}

module.exports = User;
