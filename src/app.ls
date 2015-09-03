###
#* import the pakages needed
###

require! {express, http, path, 'cookie-parser', 'body-parser', mongoose, 'express-session'}
db = require './db.js'
logger = require 'morgan'
favicon = require 'static-favicon'
routes = require './routes/'
mongoose.connect db.url

app = express!

###
#* set views
###

app.set 'views', path.join __dirname, 'views'
app.set 'view engine', 'jade'

###
#* use modules
###

app.use favicon!
app.use logger 'dev'
app.use bodyParser.json!
app.use bodyParser.urlencoded!
app.use cookieParser!
app.use express.static path.join __dirname, 'public'
app.use expressSession {
    secret: 'mySecretKey'
    resave: yes
    saveUninitialized: yes
}

console.log(routes.index)
console.log(routes.factory)
app.use '/factory', routes.factory
app.use '/', routes.index

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
