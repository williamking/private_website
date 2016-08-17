const express = require('express'),
      bcrypt = require('bcrypt');
      // requireLogin = require('./authorization/authorize.js').requireLogin,
      // hasLogin = require('./authorization/authorize').hasLogin;

const User = require('../../models/User.js');

exports.showIndexPage = (req, res) => {
    res.render('index', {user: req.session.user, username: req.session.username});
};

exports.handleLogin = (req, res) => {
    let { username, password } = req.body;
    console.log(req.body);
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    User.findOne({'name': username}, (err, user) => {
        if (err) {
            res.json({
                status: 'Server error'
            });
            return;
        }
        else {
            if (!user) {
                res.json({result: 'Error', msg: 'Username not existed!'});
                return;
            }
            else {
                if (!bcrypt.compareSync(password, user.password)) {
                    res.json({result: 'Error', msg: 'Wrong password!'});
                    return;
                }
                else {
                    req.session.user = user._id
                    req.session.username = user.name
                    req.session.type = user.type
                    req.session.avatar = user.avatar
                    res.json({status: 'OK'});
                    return;
                }
            }
        }
    });
};

exports.handleLogout = (req, res) => {
    if (req.session.user) {
        req.session.user = null;
        req.session.type = null;
        req.session.username = null;
        res.json({ status: 'OK', msg: '' });
    } else {
        res.json({ status: 'NOT_LOGIN', msg: '你还没有登录' });
    }
};

exports.handleRegister = (req, res) => {
    if (req.body.password != req.body.confirmPassword) {
        return res.json({ result: 'failed', msg: '两次输入的密码不一致' });
    }

    User.register(req.body.username, req.body.password, req.body.type, req.body.email,
    req.body.signature, req.body.qq, req.body.birthday, (err, user) => {
        if (err) {
            res.json({
                status: 'DATABASE_ERROR',
                msg: err.message
            });
        }
        else {
            req.session.user = user._id;
            req.session.username = user.name;
            req.session.type = user.type;
            res.json({status: 'OK', result: 'success'});
        }
    });
};

exports.handleGetCurrentUser = (req, res) => {
    if (req.session.user) {
        res.json({
            username: req.session.username,
            user: req.session.user,
            type: req.session.type
        });
    } else {
        res.json({});
    }
}