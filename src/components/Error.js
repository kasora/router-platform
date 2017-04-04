'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';
const md5 = require('md5');
const request = require('../utils/http');

class Error extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                Request error: {props.error}
            </div>
        )
    }
}

module.exports = Error