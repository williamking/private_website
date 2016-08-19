const mongoose = require('mongoose');
const Comment = require('./Comment.js').schema;

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

ArticleModel.findById = (id, read, callback) => {
    ArticleModel.findOne({_id: id}).exec((err, article) => {
        if (err || !article) callback(err, null);
        else {
            if (read) {
                article.readTimes++;
                article.save(callback);
            } else {
                callback(err, article);
            }
        }
    });
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
    let query;
    if (option.tag) {
        query= ArticleModel.find({category: option.tag});
    } else {
        query= ArticleModel.find({});
    }
    if (option.skip && option.limit) {
        if (skip > 0) query.skip(parseInt(option.skip));
        query.limit(parseInt(option.limit));
    }
    query.sort({ lastEditAt: -1 });
    query.exec((err, articles) => {
        let results = [];
        if (err) {
            console.log(err);
            return callback(err, articles);
        }
        console.log('get articles: ');
        console.log(articles);
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

ArticleModel.admireOneArticle = (id, callback) => {
    let query = ArticleModel.findOne({ _id: id });
    query.exec((err, article) => {
        if (err) return callback(err, null);
        if (!article) {
            callback(err, null);
        } else {
            article.pv++;
            article.save(callback);
        }
    });
};

ArticleModel.readOneArticle = (id, callback) => {
    let query = ArticleModel.findOne({ _id: id });
    query.exec((err, article) => {
        if (err) return callback(err, null);
        if (!article) {
            callback(err, null);
        } else {
            article.readTimes++;
            article.save(callback);
        }
    });
};

ArticleModel.getTags = (callback) => {
    ArticleModel
    .find({})
    .select('category')
    .exec((err, categories) => {
        if (err) return callback(err, null);
        let ca = [];
        for (let item of categories) {
            ca = ca.concat(item.category);
        }
        let hash = {}, result = [];
        for (let item of ca) {
            if (!hash[item]) {
                hash[item] = 1;
                result.push(item);
            }
        }
        return callback(err, result);
    })
}

module.exports = ArticleModel;
