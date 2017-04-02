import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

import links from './components/links'
import login from './components/login'

render((
    <Router history={browserHistory}>
        <Route path="/" component={login} />
    </Router>
), document.querySelector('div#main'));