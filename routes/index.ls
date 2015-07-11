require {'express', 'bcrypt'}

router = express.Router!

router.get '/', (req, res)!->
    res.render 'index'

router.post '/login', has-login, (req, res)!->
    username = req.body.username
    password = req.body.password
    User.find-one {'name': username}, (err, user)!->
        if err
            res.send 'error'
        else
            if not user
                res.send 'username not existed!'
            else
                if not bcrypt password, user.password
                    res.send 'Error password!'
                else
                    res.session.user = user._id
                    res.go '/'


router.get '/logout', require-login, (req, res)!->
    res.seesion.user = null
    res.go '/'

router.post '/reg', has-login, (req, res)->
   User.register req.body.username, req.body.password, req.body.email, req.body.signature, req.body.qq, req.body.birthday， (err, user)!->
       if err
           res.send 'Reg error!'
       else
           res.session.user = user._id
           res.go '/'
