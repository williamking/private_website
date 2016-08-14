/*
 * 这里是用户相关api的路由导向
 *
**/

const Index = require('../../controllers/index'),
      express = require('express'),
      router = express.Router();

module.exports = (app) => app.use('/user', router);

// Index
router.post('/current', Index.handleRegister);
