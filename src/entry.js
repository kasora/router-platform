'use strict';

const React = require('react');
const { Component } = require('react');
const { render } = require('react-dom');
const { browserHistory, Router, Route, IndexRoute, Link } = require('react-router');

const HomePageController = require('./controller/HomePageController');
const PassportController = require('./controller/PassportController');
const Title = require('./components/Title');

render((
    <HomePageController />
), document.querySelector('div#main'));