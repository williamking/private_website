require! {'express', 'bcrypt'}

router = express.Router!

router.get '/', (req, res)!->
    res.write 'Constructing....'

module.exports = router
