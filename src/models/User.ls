require ['mongoose', 'bcrypt']

User-schema = new mongoose.Schema {
    name: String,
    password: String,
    email: String,
    signature: String,
    qq: String,
    birthday: Date,
    hobbies: [String]
}

User = mongoose.model 'User', User-schema

###
* Update the information of user
* Type is the part of info you want to update
###

User.register = (name, password, email, signature, qq, birthday, callback)!->
    salt = bcrypt.gen-salt-sync(10)
    hash = bcrypt.has-sync(password, salt)
    newUser = {
        name: name,
        password: hash,
        email: email,
        signature: signature,
        qq: qq,
        birthday: birthday
    }
    User.create(new-user, callback)

User.change-info = (user-id, value, type, callback)!->
    User.find-one {_id: user-id}, (err, user)!->
        if err
            callback(err, null)
        else
            if user and type isnt 'password'
                user[type] = value
                user.save callback
            else
                callback 1, null

User.change-password = (user-id, password, callback)!->
    User.find-one {_id:user-id}, (err, user)!->
        if err
            callback(1, null)
        else
            if user
                salt = bcrypt.has-sync(password, salt)
                user.password = bcrypt.has-sync password, salt
            else
                callback 1, null

User.drop = (user-id,callback)!->
    User.remove {_id: user-id}, callback


module.exports = User
