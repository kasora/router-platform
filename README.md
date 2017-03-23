
## 简介
网页跳转平台，使用 `Express` 和 `MongoDB` 。尚未完成。

## API
|已完成|API|请求方式|接口|必要参数|可选参数|返回值|所需权限|
|------|---|-------|----|-------|-------|------|------|
|[√]|链接跳转|GET|/api/route|id|||guest+|
|[X]|用户登录|POST|/api/login|email, password||userInfo|guest|
|[X]|用户查询|GET|/api/user|id/email||name, email|guest+|
|[√]|用户注册|POST|/api/user|email, password|name|userInfo|guest|
|[X]|用户更新|PUT|/api/user|token|name, password, email|link|owner+|
|[X]|用户封停|DELETE|/api/user|token, email||link|admin|
|[X]|查询链接|GET|/api/link|token, link|page, per_page|link|owner+|
|[X]|添加链接|POST|/api/link|token, link||link|user+|
|[X]|修改链接|PUT|/api/link|token, link, new_link||link|owner+|
|[X]|删除链接|DELETE|/api/link|token, link||empty-doc|owner+|

userInfo: name, email, _id, token, tokenDispose