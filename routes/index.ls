require {'express', authorizor: './authorization/authorize'}

router = express.Router!

router.get '/', (req, res)!->
    res.render 'index'

router.post '/login', has-login, passport-authenticate 'login', {
    success-flash: 'Login successed',
    failure-flash: 'Login failed'
}

router.post '/reg', has-login, passport-authenticate, 'register', {
    success-flash: 'Regist successed',
    failure-flash: 'Regist failed'
}
