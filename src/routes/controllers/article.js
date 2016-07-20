const express = require('express'),
      bcrypt = require('bcrypt'),
      mongoose = require('mongoose');

const router = express.Router();
// const requireLogin = require('./../authorization/authorize.js').requireLogin
// const hasLogin = require('./../authorization/authorize.js').hasLogin

Article = require('../../models/Article.js');

exports.showMainPage =  (req, res) => {
    res.render('articles')
}

exports.showCreatePage =  (req, res) => {
    res.render('createArticle');
}

exports.handleCreate = (req, res) => {
    let [title, content, secret, category, secretPassword] = req.body
    let user = {
        _id: req.session.user,
        name: req.session.username
    };
    Article.createArticle(title, content, user, category, secret, secret-password, (err, article) => {
        if (err)
            res.json({result: 'Server Error', msg: err.status});
        else {
            if (article)
                res.json({result: 'Success', articleId: article._id});
        }
    });
};

exports.handleGet = (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.id);
    Article.findById(id, (err, article) => {
        if (err) {
            res.send('Server error!');
            res.end();
        }
        else {
            if (!article) {
                res.send('Article not found!');
                res.end();
            }
            else {
                res.render('childArticle', {article: article});
            }
        }
    });
};

exports.handleEditPage = (req, res) => {
    res.render('childArticle', {article: article});
};
