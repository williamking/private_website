/**
 * 这里是数据api的路由导向
 *
**/

const express = require('express'),
      router = express.Router();

/**
 * api各模块router
**/
const articleRtr = require('./api/article'),
      indexRtr = require('./api/index'),
      userRtr = require('./api/user');

/*
 * 用户登录和注册
**/
indexRtr(router);

/*
 * 用户路由
**/
userRtr(router);

/*
 * article数据的路由
**/
articleRtr(router);

module.exports = router;