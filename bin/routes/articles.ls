require! {'express', 'bcrypt', 'mongoose'}

router = express.Router!
require-login = require('./authorization/authorize.js').require-login
has-login = require('./authorization/authorize').has-login

Article = require '../models/Article.js'

router.get '/', (req, res)!->
    Article.find-index (err, index)!->
        if err
            res.send 'Server error!'
            res.end!
        else
            if not index
                res.send 'Index not found!'
                res.end!
            else
                res.render 'articles', index: index

router.get '/create', (req, res)!->
    res.render 'createArticle'

router.post '/create', (req, res)!->
    {title, content, secret, category, secret-password} = req.body
    user = {
        _id: req.session.user,
        name: req.session.username
    }
    Article.create-article title, content, user, category, secret, secret-password, (err, article)!->
        if err
            res.json {result: 'Server Error', msg: err.status}
        else
            if article
                res.json {result: 'Success', article-id: article._id}

router.get '/:id', (req, res)!->
    id = mongoose.Types.ObjectId req.params.id
    Article.find-by-id id, (err, article)!->
        if err
            res.send 'Server error!'
            res.end!
        else
            if not article
                res.send 'Article not found!'
                res.end!
            else
                res.render 'childArticle', article: article

router.get '/edit/:id', (req, res)!->
    id = mongoose.Types.ObjectId req.params.id
    Article.find-by-id id, (err, article)!->
        if err
            res.send 'Server error!'
            res.end!
        else
            if not article
                res.send 'Article not found!'
                res.end!
            else
                res.render 'childArticle', article: article

module.exports = router
