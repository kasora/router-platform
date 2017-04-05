'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';
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