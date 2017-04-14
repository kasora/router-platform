'use strict';

const React = require('react');
const { Component } = require('react');
const { render } = require('react-dom');

class Introduction extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="col-lg-4">
        <div className="bs-component">
          <h2>连接跳转平台</h2>
          <p>在平台中，您可以自由的上传链接，平台会为你提供一个独一无二的标签。</p>
          <p>只要访问标签即可快速转到您指定的链接。</p>
          <p>您可以随时修改您的链接，修改完毕后原标签就会指向新的链接。</p>
          <p>在您网盘分享补档时，这会很有效。</p>
          <p>您也可以在管理页面查看您链接的访问次数。</p>
          <p>Good luck :)</p>
          <p>源码可以在<a href="https://github.com/kasora/router-platform"> GitHub </a>上查看</p>
        </div>
      </div>
    );
  }
}

module.exports = Introduction;

