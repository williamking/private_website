require! {'express', 'bcrypt'}

require-login = require('./authorization/authorize.js').require-login
has-login = require('./authorization/authorize').has-login

User = require('../models/User.js')

router = express.Router!

router.get '/', (req, res)!->
    res.render 'index', user: req.session.user

router.post '/login', has-login, (req, res)!->
    username = req.body.username
    password = req.body.password
    User.find-one {'name': username}, (err, user)!->
        console.log err
        if err
            res.status(500).send 'Server error'
            res.end!
            return
        else
            if not user
                res.json {result: 'Error', msg: 'Username not existed!'}
                return
            else
                if not bcrypt password, user.password
                    res.json {result: 'Error', 'Error password!'}
                    return
                else
                    res.session.user = user._id
                    res.session.type = user.type
                    res.json {result: 'Success'}
                    return


router.get '/logout', require-login, (req, res)!->
    res.session.user = null
    res.seesion.type = null
    res.json {result: 'sucess'}
    res.end!

router.post '/reg', has-login, (req, res)->
   User.register req.body.username, req.body.password, req.body.email, req.body.signature, req.body.qq, req.body.birthday, (err, user)!->
       if err
           res.send 'Reg error!'
       else
           res.session.user = user._id
           res.go '/'

module.exports = router
