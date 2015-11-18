###
#* import the pakages needed
###

require! {express, http, path, 'cookie-parser', 'body-parser', mongoose, 'express-session', moment}
db = require './db.js'
logger = require 'morgan'
favicon = require 'static-favicon'
busboy = require 'connect-busboy'
mongoose.connect db.url

app = express!

###
#* set views
###

app.set 'views', path.join __dirname, 'views'
app.set 'view engine', 'jade'

###
#* set routes
###

index = require './routes/index'
labtory = require './routes/factory'
articles = require './routes/articles'
ue = require './routes/ue'
comment = require './routes/comment'

###
#* use modules
###

app.locals.moment = moment
app.use favicon!
app.use logger 'dev'
app.use bodyParser.json!
app.use bodyParser.urlencoded!
app.use cookieParser!
app.use express.static path.join __dirname, 'public'
root = path.resolve __dirname, '..'
app.use express.static path.join root, 'resources'
app.use expressSession {
    secret: 'mySecretKey'
    resave: yes
    saveUninitialized: yes
}
app.use busboy!

###
#* use routes
###

app.use '/', index
app.use '/lab', labtory
app.use '/articles', articles
app.use '/ue/uploads', ue
app.use '/comment', comment

app.use (req, res, next) ->
    err = new Error 'Not Found'
    err.status = 404
    next err

if (app.get 'env') is 'development' then app.use (err, req, res, next) ->
    res.status err.status || 500
    res.render 'error', {
        err.message
        error: err
    }

app.listen 3000, ->
    console.log 'Express listening on port 3000'

exports = module.exports = app
