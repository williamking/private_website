require! ['mongoose', 'bcrypt']

User-schema = new mongoose.Schema {
    name: {
        type: String,
        validate: {
            validator: (name)->
                /^[a-zA-Z0-9]{4,}$/.test name
            message: 'The length of username should be at least 4!'
        }
    }
    password: String,
    email: {
        type: String,
        validate: {
            validator: (email)->
                /^([a-zA-Z0-9\u4e00-\u9fa5]+[_|\_|\.-]?)*[a-zA-Z0-9\u4e00-\u9fa5]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test email
            message: 'Invalid form of email.'
        }
    }
    signature: String,
    qq: String,
    birthday: Date,
    hobbies: [String],
    type: {type: String, default: 'visitor'}
}

User = mongoose.model 'User', User-schema

###
#* Update the information of user
#* Type is the part of info you want to update
###

User.register = (name, password, type, email, signature, qq, birthday, callback)!->
    User.find-one {name: name}, (err, user)->
        if user then
           return callback {message: 'Dulplicated username'}
        salt = bcrypt.gen-salt-sync(10)
        hash = bcrypt.hash-sync(password, salt)
        console.log '2'
        newUser = {
            name: name,
            password: hash,
            type: type,
            email: email,
            signature: signature,
            qq: qq,
            birthday: birthday,
            hobbies: []
        }
        console.log new-user
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
