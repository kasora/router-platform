Router Platform
===============

[![Build Status](https://travis-ci.org/kasora/router-platform.svg?branch=master)](https://travis-ci.org/kasora/router-platform)
[![Coverage Status](https://coveralls.io/repos/github/kasora/router-platform/badge.svg?branch=master)](https://coveralls.io/github/kasora/router-platform?branch=master)

[目前可以查看的版本](https://route.kasora.moe/)

## 简介
 网页跳转平台。
* 后台使用 `Express` 和 `MongoDB` 构建。
* 后台测试使用了 `Mocha` 框架和 `supertest` 包。
* 前台使用 `React` 和 `Flux` 完成，并用 `Webpack` 进行了打包。

## API
|已完成|API|请求方式|接口|必要参数|可选参数|返回值|所需权限|
|------|---|-------|----|-------|-------|------|------|
|[x]|链接跳转|GET|/api/route|uid| | |guest+|
|[x]|用户登录|GET|/api/login|email, password| |userinfo|guest|
|[x]|用户注销|DELETE|/api/login| | |empty_doc|owner|
|[x]|用户查询|GET|/api/user|uid/email| |name, email|guest+|
|[x]|用户注册|POST|/api/user|email, password|name|userinfo|guest|
|[x]|用户更新|PUT|/api/user|email|name, password|userinfo|owner+|
|[x]|用户封停|DELETE|/api/user|email| |empty_doc|admin|
|[x]|查询链接|GET|/api/link| |page, per_page|links|owner+|
|[x]|添加链接|POST|/api/link|link| |link|user+|
|[x]|修改链接|PUT|/api/link|linkid, newlink| |link|owner+|
|[x]|删除链接|DELETE|/api/link|linkid| |empty_doc|owner+|

userinfo: name, email, _id, purview

## Website
* main
  * HomePageController
    * Links
  * PassportController
    * Login
    * Signup
  

