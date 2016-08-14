/*
 * 这里是article相关页面的路由导向
 *
**/

const Article = require('../controllers/article'),
      express = require('express'),
      router = express.Router();

router.get('/', Article.showMainPage);
router.get('/file/', Article.showDetailPage);
router.get('/create', Article.showCreatePage);

module.exports = router;