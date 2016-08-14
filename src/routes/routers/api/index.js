/*
 * 这里是用户相关api的路由导向
 *
**/

const Index = require('../../controllers/index'),
      express = require('express'),
      router = express.Router();

module.exports = (app) => app.use('/', router);

// Index
router.post('/register', Index.handleRegister);
router.post('/login', Index.handleLogin);
router.get('/logout', Index.handleLogout);
router.get('/get_current_user', Index.handleGetCurrentUser);
