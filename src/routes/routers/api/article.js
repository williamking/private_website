/*
 * 这里是article相关api的路由导向
 *
**/

const Article = require('../../controllers/article'),
      express = require('express'),
      router = express.Router();

const { requireAdministrator } = require('../../authorization/authorize');

module.exports = (app) => app.use('/articles', router);
 
router.get('/', Article.getArticleList);
router.get('/file/', Article.getOneArticleByFile);
router.get('/tags', Article.getTags);
router.post('/create/', requireAdministrator, Article.handleCreate);
router.get('/:id', Article.getOneArticleById);
router.patch('/:id', requireAdministrator, Article.editArticle);
router.get('/:id/admire', Article.admireOneArticle);
router.post('/:id/comments', Article.commentOneArticle);
router.post('/:id/comments/:commentId', Article.replyOneComment);
