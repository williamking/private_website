require! {'express', 'bcrypt'}

require-login = require('./authorization/authorize.js').require-login;
has-login = require('./authorization/authorize').has-login;

router2 = express.Router!

router2.get '/', (req, res)!->
    res.write('Constructing....');
    res.end();

router2.get '/drawing', (req, res)!->
    res.render 'drawing'

router2.get '/threejs', (req, res)!->
    res.render '3dworld'

router2.get '/imageprocess', (req, res)!->
    res.render 'imageProcess'

module.exports = router2
