require ['./login', './signup', '../models/User']

module.exports = (passport)->
    passport.serialize-user (user, done)->
        console.log 'Serialize user:', user
        done null, user

    passport.deserialize-user (user, done)->
        User.find-by-id id, (err, user)!->
            console.log 'Deserialize user:', user
            done err, user
