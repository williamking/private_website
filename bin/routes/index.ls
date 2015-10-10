require! {'express', 'bcrypt'}

require-login = require('./authorization/authorize.js').require-login
has-login = require('./authorization/authorize').has-login

User = require('../models/User.js')

router = express.Router!

router.get '/', (req, res)!->
    res.render 'index', user: req.session.user, username: req.session.username

router.post '/login', has-login, (req, res)!->
    username = req.body.username
    password = req.body.password
    console.log password
    salt = bcrypt.gen-salt-sync 10
    hash = bcrypt.hash-sync password, salt
    console.log salt
    User.find-one {'name': username}, (err, user)!->
        if err
            res.status(500).send 'Server error'
            res.end!
            return
        else
            if not user
                res.json {result: 'Error', msg: 'Username not existed!'}
                return
            else
                console.log user.password
                if not bcrypt.compare-sync password, user.password
                    res.json {result: 'Error', msg: 'Wrong password!'}
                    return
                else
                    req.session.user = user._id
                    req.session.username = user.name
                    req.session.type = user.type
                    res.json {result: 'Success', msg: ''}
                    return


router.get '/logout', require-login, (req, res)!->
    req.session.user = null
    req.session.type = null
    res.json {result: 'Success', msg: ""}

router.post '/reg', has-login, (req, res)->
    User.register req.body.username, req.body.password, req.body.type, req.body.email, req.body.signature, req.body.qq, req.body.birthday, (err, user)!->
        if err
            res.status(500).send err.message
            console.log err
            res.end!
        else
            req.session.user = user._id
            req.session.username = user.name
            req.session.type = user.type
            res.json {result: 'success'}

module.exports = router
