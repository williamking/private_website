const express = require('express');
      // requireLogin = require('./authorization/authorize.js').requireLogin,
      // hasLogin = require('./authorization/authorize').hasLogin;

const User = require('../../models/User.js');

exports.showIndexPage = (req, res) => {
    console.log(req.session);
    res.render('index', {user: req.session.user, username: req.session.username});
};

exports.showLoginPage = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(password);
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    User.findOne({'name': username}, (err, user) => {
        if (err) {
            res.status(500).send('Server error');
            res.end();
            return;
        }
        else {
            if (!user) {
                res.json({result: 'Error', msg: 'Username not existed!'});
                return;
            }
            else {
                if (!bcrypt.compare-sync(password, user.password)) {
                    res.json({result: 'Error', msg: 'Wrong password!'});
                    return;
                }
                else {
                    req.session.user = user._id
                    req.session.username = user.name
                    req.session.type = user.type
                    res.json({result: 'Success', msg: ''});
                    return;
                }
            }
        }
    });
};

exports.handleLogin = (req, res) => {
    req.session.user = null;
    req.session.type = null;
    res.json({result: 'Success', msg: ''});
};

exports.handleRegister = (req, res) => {
    User.register(req.body.username, req.body.password, req.body.type, req.body.email,
    req.body.signature, req.body.qq, req.body.birthday, (err, user) => {
        if (err) {
            res.status(500).send(err.message);
            console.log(err);
            res.end();
        }
        else {
            req.session.user = user._id;
            req.session.username = user.name;
            req.session.type = user.type;
            res.json({result: 'success'});
        }
    });
};

