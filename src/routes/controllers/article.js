const express = require('express'),
      bcrypt = require('bcrypt'),
      mongoose = require('mongoose'),
      co = require('co'),
      Promise = require('bluebird'),
      fs = Promise.promisifyAll(require('fs')),
      path = require('path');

const router = express.Router();
// const requireLogin = require('./../authorization/authorize.js').requireLogin
// const hasLogin = require('./../authorization/authorize.js').hasLogin

const ArticleMode = {
    file: Symbol(),
    database: Symbol(),
};

const dirPath = '/home/william/web-studying-note';

let mode = ArticleMode.file;

let Article = require('../../models/Article.js'),
    Comment = require('../../models/Comment.js').model;

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
        return timeB - timeA;
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
    let requireField = ['title', 'content', 'category', 'secret'];
    for (let key of requireField) {
        if (Object.keys(req.body).indexOf(key) == -1)
            return res.json({status: 'LACK_FEILD', msg: '文章信息缺少'});
    }
    Article.createArticle(req.body, (err, article) => {
        if (err)
            res.json({status: 'Server Error', msg: err.status});
        else {
            if (article)
                res.json({status: 'OK', articleId: article._id});
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
    } else {
        let skip = req.query.start,
            limit = req.query.end - req.query.start;
        let option = {};
        if (skip && limit) {
            option = {
                skip,
                limit
            };
        }

        if (req.query.tag) option.tag = req.query.tag;

        Article.getList(option, (err, articles) => {
            if (err) {
                res.json({ status: 'DATABASE_ERROR', msg: '数据库菌出了问题。。。。。。' });
            }
            else {
                if (!articles) {
                    res.json({ status: 'ARTICLE_NOT_FOUND', msg: '找不到文章' });
                }
                else {
                    res.json({ status: 'OK', data: { list: articles } });
                }
            }
        });
    }
};

exports.getOneArticleByFile = (req, res) => {
    let path = req.query.path;
    console.log('Require article file from: ' + path);
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
};

exports.getOneArticleById = (req, res) => {
    let id = req.params.id;
    console.log('Require article which id is ' + id);
    Article.findById(id, true, (err, article) => {
        if (err)
            res.json({ status:'DATABASE_ERROR', msg:'数据库菌出了问题。。。。。。' });
        else
            res.json({ status:'OK', data: article });
    });
};

exports.admireOneArticle = (req, res) => {
    let id = req.params.id;
    console.log('Admire article ' + id);
    Article.admireOneArticle(id, (err, article) => {
        if (err) res.json({ status: 'DATABASE_ERROR', msg: '数据库菌出了问题。。。。。。' });
        else {
            if (!article) res.json({ status: 'ARTICLE_NOT_FOUND', msg: '没有该文章喔！' });
            else res.json({ status: 'OK', data: article.pv });
        }
    })
}

exports.commentOneArticle = (req, res) => {
    let id = req.params.id;
    console.log('查找被评论的文章');
    Article.findById(id, false, (err, article) => {
        if (err || !article) {
            res.json({ status: 'DATABASE_ERROR', msg: '数据库菌出了问题。。。。。。' });
        } else {
            console.log('成功，创建新评论......');
            article.comments.unshift({
                content: req.body.content,
                commentor: req.session.username || 'visitor',
                avatar: req.session.avatar || '/images/visitor.jpg'
            });
            article.save((err, article) => {
                if (err || !article) {
                    res.json({
                        status: 'DATABASE_ERROR',
                        msg: '数据库菌出了问题。。。。。。'
                    })
                } else {
                    res.json({
                        status: 'OK',
                        data: article.comments[0]
                    });
                }
            });
        }
    });
}

exports.replyOneComment = (req, res) => {
    let id = req.params.id;
    // console.log('查找被评论的文章');
    Article.findById(id, false, (err, article) => {
        if (err || !article) {
            res.json({ status: 'DATABASE_ERROR', msg: '数据库菌出了问题。。。。。。' });
        } else {
            console.log('成功，查找评论......');
            let comment = article.comments.id(req.params.commentId);
            comment.reply = req.body.content;
            article.save((err, article) => {
                if (err || !article)
                    return res.json({ status: 'DATABASE_ERROR', msg: '数据库菌出了问题。。。。。。' });
                else {
                    res.json({ status: 'OK', data: comment });
                }
            });
        }
    });
};

exports.getTags = (req, res) => {
    Article.getTags((err, tags) => {
        if (err || !tags) {
            res.json({ status: 'DATABASE_ERROR', msg: '数据库菌出了问题。。。。。。' });
        } else {
            res.json({ status: 'OK', data: tags });
        }
    })
};

exports.editArticle = (req, res) => {
    let id = req.params.id,
      title = req.body.title,
      content = req.body.content;
    Article.editArticle(id, title, content, (err, article) => {
      if (err || !article) {
          res.json({ status: 'DATABASE_ERROR', msg: '数据库菌出了问题。。。。。。' });
      } else {
          console.log(`编辑文章${id}`);
          res.json({ status: 'OK', data: {
              title: article.title,
              content: article.content
          } });
      }
    });
};

exports.addAttachment = co.wrap(function* (req, res) {
    if (!req.file) {
        return res.json({
            status: 'NO_FILE',
            msg: '没有文件上传'
        });
    } else {
        return res.json({
            downloadUrl: `/attachments/article-images/${req.file.filename}`
        });
    }
});
