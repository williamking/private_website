require! {'../models/User', 'bcrypt-nodejs', 'passport-local'}
Local-strategy = passport-local.Strategy

is-valid-password = (user, password)->
    bcrypt-nodejs.compare-sync password, user.password

module.exports = (passport)!->
    passport.use 'login', new Local-strategy pass-req-to-callback: true, (req, name, password, done)!->
        User.find-one {name: name}, (err, user)!->
            console.log 'Err login' if err 
            if not user
                done, null, false, req.flash 'message', "User #{name} doesn\'t exist!"
            else if not is-valid-password user, password
                done null, false, req.flash 'message', "Incorect password."
            else
                done null, user
