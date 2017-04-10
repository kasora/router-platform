'use strict';

const React = require('react');
const { Component } = require('react');
const { render } = require('react-dom');
const { browserHistory, Router, Route, IndexRoute, Link } = require('react-router');

const md5 = require('md5');
const request = require('../utils/http');

class ErrorBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Error: {this.props.error}</h1>
            </div>
        )
    }
}

module.exports = ErrorBox;