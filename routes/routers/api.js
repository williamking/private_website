/*
 * 这里是数据api的路由导向
 *
**/

const Article = require('../controllers/article'),
      express = require('express'),
      router = express.Router();

/*
 * article数据的路由
**/
router.get('/article', Article.getArticleList);
router.get('/article/file', Article.getOneArticleByFile);

module.exports = router;