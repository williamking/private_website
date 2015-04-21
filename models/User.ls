require ['mongoose']

User-schema = new mongoose.Schema {
    name: String,
    password: String,
    email: String,
    sign: String,
    qq: String,
}

User-model = mongoose.model 'User', User-schema

###
× Update the information of user
* Type is the part of info you want to update
###

User-model.update = (user-id, info, type, callback)!->
    User.find-one {_id: user-id}, (err, user)!->
        if user
            user[type] = info[type]
            user.save !->
                callback!
        else
            callback 1, null 

module.exports = User-model
