const mongoose = require('mongoose');
const Comment = require('./Comment.js');

const ObjectId = mongoose.Schema.Types.ObjectId;

const ArticleSchema = new mongoose.Schema({
    title: {
        type: 'String',
        required: true
    },
    createAt: { type: Date, default: Date.now },
    lastEditAt: { type: Date, default: Date.now },
    content: String,
    category: [String],
    pv: { type: Number, default: 0 },
    readTimes: { type: Number, default: 0 },
    secret: Boolean,
    comments: [Comment]
});

const ArticleModel = mongoose.model('Article', ArticleSchema);

ArticleModel.createArticle = (args, callback) => {
    let { title, content, category, secret } = args;
    article = new ArticleModel({
        title,
        content,
        category,
        secret: secret,
        comments: []
    });
    article.save(callback);
};

ArticleModel.addComment = (id, comment, callback) => {
    ArticleModel.find({_id: id}, (err, article) => {
        if (article) {
            article.comments.push(comment);
            article.save(callback);
        } else {
            callback(1);
        }
    });
};

ArticleModel.findIndex = (callback) => {
    ArticleModel.find({}).sort({'createAt': 1}).select('title author createAt').exec(callback)
};

ArticleModel.findById = (id, callback) => {
    ArticleModel.findOne({_id: id}).exec(callback);
};

ArticleModel.findByCategory = (author, category, callback) => {
    ArticleModel.find({'category': category, 'author': author}).sort({'createAt': 1}).exec(callback);
};

ArticleModel.updateContent = (id, content, callback) => {
    ArticleModel.findOne({_id: id}, (err, article)=> {
        if (article) {
            article.content = content
            article.save(callback);
        }
        else {
            callback(1, null);
        }
    });
}

ArticleModel.addComment = (content, commentor, callback) => {
    ArticleModel.findOne({_id: id}, (err, article) => {
        if (err) {
            callback(1, null);
        } else {
            if (article) {
                Comment.addComment(content, commentor, null, callback, (err, comment) => {
                  article.comments.push(comment);
                  callback(0, comment);
                });
            } else {
                callback(1, null);
            }
        }
    });
}

ArticleModel.getComments = (id, callback) => {
    ArticleModel.findOne({_id, id}, (err, article) => {
        if (err) {
            callback(1, null);
        } else {
            if (article) {
            }
        }
    });
}

ArticleModel.drop = (id, callback) => {
    ArticleModel.remove({_id: id}, callback);
};

ArticleModel.getList = (option, callback) => {
    let query = ArticleModel.find({});
    if (option.skip && option.limit) {
        query.skip(skip);
        query.limit(limit);
    }
    query.exec((err, articles) => {
        let results = [];
        if (err) return callback(err, articles);
        for (let article of articles) {
            results.push({
                _id: article._id,
                title: article.title,
                lastEditAt: article.lastEditAt,
                category: article.category,
                content: article.content.substr(0, 50) + '...'
            });
        }
        return callback(err, results);
    });
};

module.exports = ArticleModel;
