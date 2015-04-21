require! ['./login', './signup', '../models/user']

module.exports = (passport)-> 
    passport.serialize-user (user, done)->
        console.log 'Sericalize user:', user
        done null, user._id

    passport.deserialize-user (id, done)!->
        User.findById(id, (err, user)->
            done err, user
                
