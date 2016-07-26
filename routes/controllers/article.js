const express = require('express'),
      bcrypt = require('bcrypt'),
      mongoose = require('mongoose'),
      Promise = require('bluebird'),
      fs = Promise.promisifyAll(require('fs'));

const router = express.Router();
// const requireLogin = require('./../authorization/authorize.js').requireLogin
// const hasLogin = require('./../authorization/authorize.js').hasLogin

const ArticleMode = {
    file: Symbol(),
    database: Symbol(),
};

const dirPath = '/home/william/web-studying-note';

let mode = ArticleMode.file;

let Article = require('../../models/Article.js');

/*
 * 以下是自定义函数
 *
**/

function getFileListFromLocal(dirPath) {
    let list = [];

    return fs.readdirAsync(dirPath).then((files) => {
        let states = [];
        files.forEach((file) => {
            let pathName = dirPath + '/' + file,
                fileState = fs.statAsync(pathName);
            if (file == '.git') return;
            if (file == 'README.md') return;
            states.push(fileState.then((stat) => {
                // console.log(stat);
                if (stat.isDirectory()) return getFileListFromLocal(pathName);
                else return {
                    title: file.split('.')[0],
                    path: pathName,
                    createTime: stat.birthtime,
                    description: '自行想象'
                };
            }));
            });
        return Promise.all(states).then((results) => {
            return  results.reduce((a,b) => {
                if (Object.prototype.toString.call(a) != '[object Array]') {
                    a = [a];
                }
                return a.concat(b);
            });
        });
    })
}

function sortByTime(fileNames) {
    fileNames.sort(function(a, b) {
        let timeA = new Date(a.createTime),
            timeB = new Date(b.createTime);
        return timeA < timeB;
    });
    return fileNames;
}

/*
 * 以下是页面路由函数
 *
**/

exports.showMainPage = (req, res) => {
    res.render('articles');
}

exports.showCreatePage = (req, res) => {
    res.render('create_article');
}

exports.showEditPage = (req, res) => {
    res.render('child_article');
};

exports.showDetailPage = (req, res) => {
    res.render('article_content');
};

/*
 * 以下是数据路由函数
 *
**/

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

exports.getArticleList = (req, res) => {
    // if (mode == ArticleMode.file) {
    if (req.query.mode == 'file') {
        getFileListFromLocal(dirPath).then((fileNames) => {
            fileNames = sortByTime(fileNames);
            if (req.query.start && req.query.end && req.query.start <= req.query.end) {
                fileNames = fileNames.slice(Math.max(0, req.query.start), Math.min(req.query.end, fileNames.length));
            }
            res.send({
                status: 'OK',
                data: {
                    list: fileNames
                }
            });
        }); 
    }

    // let id = mongoose.Types.ObjectId(req.params.id);
    // Article.findById(id, (err, article) => {
    //     if (err) {
    //         res.send('Server error!');
    //         res.end();
    //     }
    //     else {
    //         if (!article) {
    //             res.send('Article not found!');
    //             res.end();
    //         }
    //         else {
    //             res.render('childArticle', {article: article});
    //         }
    //     }
    // });
};

exports.getOneArticleByFile = (req, res) => {
    let path = req.query.path;
    fs.readFileAsync(path, 'utf8').then((data) => {
        let title = path.split('/');
        title = title[title.length - 1].split('.')[0];
        res.send({
            status: 'OK',
            data: {
                content: data,
                title: title
            }
        });
    });
}
