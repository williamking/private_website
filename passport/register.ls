require {'../models/User', 'bcrypt-nodejs', 'passport-local'}
Local-strategy = passport-local.Strategy

hash = (password)-> bcrypt-nodejs.hash-sync password, (bcrygt-nodejs, gen-salt-sync 10), null

module.exports = (passport)!->
    passport.use 'register', new Local-strategy pass-req-to-callback: true, (req, name, password, done)!->
        User.find-one {name: name}, (err, user)!->
            if err
                console.log 'Error in register', error
                done error
            if user
                console.log msg = "User: #{name} has exists!"
                done null, false, req.flash 'message', msg
            else
                new-user = new User {
                    name : name
                    password: hash password
                    email: req.param 'email'
                    sign: req.param 'sign'
                    qq: req.param 'qq'
                }
                new-user.save (err)!->
                    if err
                        console.log "Error register: ", error
                        throw error
                    else
                        console.log "Success to register!"
                        done null, new-user
