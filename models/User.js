const mongoose = require('mongoose'),
      bcrypt = require('bcrypt');

const saltRounds = 10;

UserSchema = new mongoose.Schema({
    name: {
        type: String,
        validate: {
            validator: (name) => {
                /^[a-zA-Z0-9]{4,}$/.test(name);
            },
            message: 'The length of username should be at least 4!'
        }
    },
    password: String,
    email: {
        type: String,
        validate: {
            validator: (email) => {
                /^([a-zA-Z0-9\u4e00-\u9fa5]+[_|\_|\.-]?)*[a-zA-Z0-9\u4e00-\u9fa5]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email);
            },
            message: 'Invalid form of email.'
        }
    },
    signature: String,
    qq: String,
    birthday: Date,
    hobbies: [String],
    type: {type: String, default: 'visitor'}
});

User = mongoose.model('User', UserSchema);

// Update the information of user
// Type is the part of info you want to update


User.register = (name, password, type, email, signature, qq, birthday, callback) => {
    User.findOne({name: name}, (err, user) => {
        if (user)
           return callback({message: 'Dulplicated username'});
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)
        let newUser = {
            name: name,
            password: hash,
            type: type,
            email: email,
            signature: signature,
            qq: qq,
            birthday: birthday,
            hobbies: []
        }
        User.create(newUser, callback)
    });
}

User.changeInfo = (userId, value, type, callback) => {
    User.findOne({_id: userId}, (err, user) => {
        if (err)
            callback(err, null)
        else {
            if (user && type !== 'password' && user[type]) {
                user[type] = value
                user.save(callback);
            }
            else
                callback(1, null);
        }
    });
}

User.changePassword = (userId, password, callback) => {
    User.findOne({_id:userId}, (err, user) => {
        if (err )
            callback(1, null);
        else {
            if (user) {
                salt = bcrypt.hasSync(password, salt);
                user.password = bcrypt.hasSync(password, salt);
            }
            else
                callback(1, null);
        }
    });
}

User.drop = (userId,callback) => {
    User.remove({_id: userId}, callback);
}


module.exports = User
