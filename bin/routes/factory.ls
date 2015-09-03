require! {'express', 'bcrypt'}

require-login = require('./authorization/authorize.js').require-login;
has-login = require('./authorization/authorize').has-login;

router2 = express.Router!

router2.get '/', (req, res)!->
    res.write('Constructing....');

router2.get '/drawing', (req, res)!->
    res.render 'drawing'

console.log('hehe')

module.exports.factory = router2
