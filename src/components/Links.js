'use strict';

const React = require('react');
const { Component } = require('react');
const { render } = require('react-dom');
const { browserHistory, Router, Route, IndexRoute, Link } = require('react-router');
const request = require('../utils/http');
const config = require('../../config');

require('classlist-polyfill');

class Links extends Component {
  constructor() {
    super();

    this.state = {
    };

    this.renewLinks = this.renewLinks.bind(this);
    this.deleteHandle = this.deleteHandle.bind(this);
    this.updateHandle = this.updateHandle.bind(this);
    this.newLinkHandle = this.newLinkHandle.bind(this);
    this.onLinkChange = this.onLinkChange.bind(this);

    this.renewLinks();
  }

  renewLinks() {
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

  deleteHandle(event) {
    let row = event.target.parentNode.parentNode;
    let offset = row.getAttribute("offset");
    row.classList.remove("info");
    row.classList.add("warning");
    row.childNodes[3].innerHTML = "pending";
    let data = {
      linkid: this.state.links[offset].linkid,
    }
    request.delete(`/api/link`, data).then((res) => {
      row.classList.remove("warning");
      row.childNodes[3].innerHTML = "";
      this.renewLinks();
    }, (err) => {
      row.classList.remove("warning");
      row.classList.add("danger");
      row.childNodes[3].innerHTML = "error";
    });
  }

  updateHandle(event) {
    let row = event.target.parentNode.parentNode;
    let offset = row.getAttribute("offset");
    let linkid = this.state.links[offset].linkid;
    let link = row.firstChild.firstChild.value;
    let data = {
      linkid: this.state.links[offset].linkid,
      newlink: row.firstChild.firstChild.value,
    }
    row.classList.remove("info");
    row.classList.add("warning");
    row.childNodes[3].innerHTML = "pending";
    request.put(`/api/link`, data).then((res) => {
      row.classList.remove("warning");
      row.classList.add("success");
      row.childNodes[3].innerHTML = "success";
    }, (err) => {
      row.classList.remove("warning");
      row.classList.add("danger");
      row.childNodes[3].innerHTML = "error";
    });
  }

  newLinkHandle(event) {
    let row = event.target.parentNode.parentNode;
    let data = {
      link: row.firstChild.firstChild.value,
    }
    request.post(`/api/link`, data).then(
      this.renewLinks()
    );
    row.firstChild.firstChild.value = "";
  }

  onLinkChange(event) {
    let offset = event.target.getAttribute("offset");
    this.state.links[offset].link = event.target.value;

    let row = event.target.parentNode.parentNode;
    row.classList.add("info");

    this.setState();
  };

  render() {
    if (this.state.links && (!this.state.err)) {
      return (
        <div >
          <h3 className="blockTitle">Links</h3>
          <table className="table table-striped table-hover table-outside-bordered">
            <thead>
              <tr>
                <th>your link</th>
                <th>short link</th>
                <th>count</th>
                <th>status</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.links.map((link, offset) => {
                  return (
                    <tr offset={offset}>
                      <td>
                        <input id="linkurl" offset={offset} className="form-control" value={link.link} onChange={this.onLinkChange} />
                      </td>
                      <td>
                        <a href={`/api/route?linkid=${link.linkid}`}>
                          {`${config.site}/api/route?linkid=${link.linkid}`}
                        </a>
                      </td>
                      <td>
                        {link.count}
                      </td>
                      <td>
                      </td>
                      <td>
                        <button className="btn btn-default" onClick={this.updateHandle}>update</button>&nbsp;
                        <button className="btn btn-default" onClick={this.deleteHandle}>delete</button>
                      </td>
                    </tr>
                  )
                })
              }
              <tr className="info">
                <td><input id="linkurl" className="form-control" /></td>
                <td></td>
                <td></td>
                <td></td>
                <td><button className="btn btn-default" onClick={this.newLinkHandle}>Add link</button></td>
              </tr>
            </tbody>
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