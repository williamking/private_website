require! {'express', 'bcrypt'}

require-login = require('./authorization/authorize.js').require-login;
has-login = require('./authorization/authorize').has-login;

router2 = express.Router!

router2.get '/', (req, res)!->
    res.write('Constructing....');
    res.end();

router2.get '/drawing', (req, res)!->
    res.render 'drawing'

module.exports = router2
