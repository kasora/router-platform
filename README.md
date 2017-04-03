Router Platform
===============

[![Build Status](https://travis-ci.org/kasora/router-platform.svg?branch=master)](https://travis-ci.org/kasora/router-platform)


## 简介
网页跳转平台，使用 `Express` 和 `MongoDB` 。尚未完成。

## API
|已完成|API|请求方式|接口|必要参数|可选参数|返回值|所需权限|
|------|---|-------|----|-------|-------|------|------|
|[√]|链接跳转|GET|/api/route|uid| | |guest+|
|[√]|用户登录|GET|/api/login|email, password| |userinfo|guest|
|[√]|用户注销|DELETE|/api/login| | |empty_doc|owner|
|[√]|用户查询|GET|/api/user|uid/email| |name, email|guest+|
|[√]|用户注册|POST|/api/user|email, password|name|userinfo|guest|
|[√]|用户更新|PUT|/api/user|email|name, password|userinfo|owner+|
|[√]|用户封停|DELETE|/api/user|email| |empty_doc|admin|
|[√]|查询链接|GET|/api/link| |page, per_page|links|owner+|
|[√]|添加链接|POST|/api/link|link| |link|user+|
|[√]|修改链接|PUT|/api/link|linkid, newlink| |link|owner+|
|[√]|删除链接|DELETE|/api/link|linkid| |empty_doc|owner+|

userinfo: name, email, _id, purview
