require! {'express', 'bcrypt', 'mongoose'}

router = express.Router!
require-login = require('./authorization/authorize.js').require-login
has-login = require('./authorization/authorize').has-login

Comment = require '../models/Comment.js'
Article = require '../models/Article.js'

router.post '/create/:id', (req, res) !->
    {content, commentor, reply-to} = req.body
    id = req.params.id
    console.log id
    Comment.add-comment content, commentor, null, (err, comment)!->
        if err
            res.json {result: 'Server Error', msg: err.status}
        else
            res.json {result: 'Success'}
            console.log comment

module.exports = router
