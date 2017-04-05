import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute, IndexRedirect } from 'react-router';

import HomePageController from './controller/HomePageController';
const PassportController = require('./controller/PassportController');

render((
    <Router history={browserHistory}>
        <Route path='/'>
            <IndexRoute component={HomePageController} />
            <Route path='/index' component={HomePageController} />
            <Route path='/passport/:action' component={PassportController} />
        </Route>
    </Router>
), document.querySelector('div#main'));