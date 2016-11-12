/*
 * 这里是article相关api的路由导向
 *
**/

const Article = require('../../controllers/article'),
      express = require('express'),
      multer = require('multer'),
      router = express.Router(),
      path = require('path'),
      co = require('co'),
      Promise = require('bluebird'),
      fs = Promise.promisifyAll(require('fs')),
      { root } = require(path.join(__dirname, '..', '..', '..', 'config/config.js'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = path.join(root, 'public', 'attachments', 'article-images');
        try {
            fs.exists(dir, (exist) => {
                if (!exist) {
                    fs.mkdirAsync(dir).then(() => {
                        return cb(null, dir);
                    }).catch(e => {
                        console.log(e);
                        return res.json({
                            status: 'FILE_ERROR',
                            msg: '文件系统错误'
                        });
                    });
                } else {
                    return cb(null, dir);
                }                                        
            });
        } catch(e) {
            console.log(e);
            return res.json({
                status: 'FILE_ERROR',
                msg: '文件系统错误'
            });
        }
    },
    filename: (req, file, cb) => {
        return cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({
    storage
});

const { requireAdministrator } = require('../../authorization/authorize');

module.exports = (app) => app.use('/articles', router);
 
router.get('/', Article.getArticleList);
router.get('/file/', Article.getOneArticleByFile);
router.get('/tags', Article.getTags);
router.post('/create/', requireAdministrator, Article.handleCreate);
router.get('/:id', Article.getOneArticleById);
router.patch('/:id', requireAdministrator, Article.editArticle);
router.post('/attachment', requireAdministrator, upload.single('image'), Article.addAttachment);
router.get('/:id/admire', Article.admireOneArticle);
router.post('/:id/comments', Article.commentOneArticle);
router.post('/:id/comments/:commentId', Article.replyOneComment);
