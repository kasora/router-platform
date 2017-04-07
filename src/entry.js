import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute, IndexRedirect } from 'react-router';

import HomePageController from './controller/HomePageController';
const PassportController = require('./controller/PassportController');
const Title = require('./components/Title');

render((
    <HomePageController />
), document.querySelector('div#main'));