'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import request from '../utils/http';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router';

class Links extends Component {
  constructor() {
    super();

    this.state = {

    };
    request.get('/api/link').then((allLink) => {
      this.setState({
        links: allLink.sort(),
      })
    }, (err) => {
      this.setState({
        error: err,
      })
    });
  }

  render() {
    if (this.state.links) {
      return (
        <div>
          <h3 className="blockTitle">Links</h3>
          <table>
            {
              this.state.links.map((link, offset) => {
                return (
                  <tr>
                    <td>
                      <Link key={offset} to={link.link}>
                        link:{`https://route.kasora.moe/api/route?id=${link.linkid}`}
                      </Link>
                    </td>
                    <td>
                      count:{link.count}
                    </td>
                  </tr>
                )
              })
            }
          </table>
        </div>
      )
    }
    else {
      return (
        <div>
          <h3>Login first, please.</h3>
        </div>
      )
    }
  }
}

module.exports = Links;