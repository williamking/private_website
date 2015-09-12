require! {'express', 'bcrypt'}

router = express.Router!

Article = require '/models/Articles/Article'

router.get '/', (req, res)!->
    

