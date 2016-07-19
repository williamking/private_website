require('mongoose');
const Comment = require('./Comment.js');

const ObjectId = mongoose.Schema.Types.ObjectId;

const ArticleSchema = new mongoose.Schema({
    title: {
        type: 'String',
        required: true
    },
    createAt: { type: Date, default: Date.now },
    author: {
        _id: {
            type: ObjectId,
            ref: 'User'
        },
        name: String
    },
    lastEditAt: { type: Date, default: Date.now },
    content: String,
    category: [String],
    secret: Boolean,
    secretPassword: {
       type: 'String',
       require: true
    },
    comments: [Comment]
});

const ArticleModel = mongoose.model('Article', ArticleSchema);

ArticleModel.createArticle = (title, content, author, category, secret, secret-password, callback) => {
    article = new ArticleModel({
        title: title,
        author: author,
        content: content,
        secret: secret,
        secretPassword: secretPassword,
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
    }
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
        if article {
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
                  article.comments.push comment
                  callback 0, comment
                });
            } else {
                callback(1, null);
            }
        }
    });
}

ArticleModel.getComments = (id, callback) => {
    ArticleModel.findOne({_id, id}, (err, article)!->
        if (err) {
            callback(1, null);
        } else {
            if (article) {
            }
        }
}

ArticleModel.drop = (id, callback)!->
    ArticleModel.remove({_id: id}, callback);

module.exports = ArticleModel
