/*
 * 这里是article相关api的路由导向
 *
**/

const Article = require('../../controllers/article'),
      express = require('express'),
      router = express.Router();

module.exports = (app) => app.use('/articles', router);
 
router.get('/', Article.getArticleList);
router.get('/file/', Article.getOneArticleByFile);
router.post('/create/', Article.handleCreate);
router.get('/:id', Article.getOneArticleById);