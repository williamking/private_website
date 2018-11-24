# RESTful规范以及API设计

## 一、RESTful架构
RESTful架构是一种互联网软件的架构，它遵循REST(Representational State Transfer)原则。
它将一个资源(Resources)用一个URI来表示，通过URI获取以某种形式呈现的资源(Representational)。
形式包括txt、html、xml、json等等。。。。。。这个信息应该在HTTP请求的头信息中的Accept和Content-Type字段
指定。

客户端与服务端交互的过程，是对资源的状态的更改，叫做状态转化(State Transfer)。状态转化也就是对资源的增删
改查操作，再请求中是用请求方法来表示，通常有GET(查)、POST(增)、PUT(改)、DELETE(删)。

## 二、RESTful API
这是一套比较成熟的web应用前后端的API设计准则。具体的准则有：
1.总是使用HTTPS协议
2.域名
应该将API部署在一个专用域名或者主域名下，如：
```
https://api.example.com
https://example.com/api
```
3.应该将API版本号放入URL，如：
```
https://api.example.com/v1/
```
4.URL中应该用资源名复数形式作为标识，如:
```
https://api.example.com/v1/animals
```
5.对数据的基本操作由HTTPS请求动词表示，这点在前面已经说明
6.对于查询返回结果的请求，特殊查询条件应作为参数放在URL中(id除外，应作为URL一部分)，如:
```
https://api.example.com/v1/animals?type=bird
```
7.以状态码作为向客户端返回的请求状态
8.根据不同请求状态返回不同的信息，一般4开头状态码返回下面格式的json:
```
{
	error: 'error message'
}
```
9.请求成功时返回结果有以下规范：
* GET /collection：返回资源数组
* GET /collection/resource: 返回单个资源对象
* POST /collection: 返回创建的单个资源对象
* PUT /collection/resource: 返回完整的修改资源对象
* PATCH /collection/resource: 同上
* DELETE /collection/resource: 返回空文档
10.再返回资源结果中提供该对象可进行的数据操作的API链接，如：
```
{"link": {
  "rel":   "collection https://www.example.com/zoos",
  "href":  "https://api.example.com/zoos",
  "title": "List of zoos",
  "type":  "application/vnd.yourformat+json"
}}
```
11.
1)API身份认证应用OAuth 2.0
2)尽量用JSON返回数据

### 本笔记摘自阮一峰老师的文章:[理解RESTful架构](http://www.ruanyifeng.com/blog/2011/09/restful)和[RESTful API设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)，十分感谢