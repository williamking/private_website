require! ['mongoose']
Comment = require './Comment.js'

Object-id = mongoose.Schema.Types.Object-id

Article-schema = new mongoose.Schema {
    title: {
        type: 'String',
        required: true
    },
    create-at: { type: Date, default: Date.now }
    author: {
        _id: {
            type: Object-id,
            ref: 'User'
        },
        name: String
    }
    last-edit-at: { type: Date, default: Date.now }
    content: String,
    category: [String],
    secret: Boolean,
    secret-password: {
       type: 'String',
       require: true
    },
    comments: [Comment]
}

Article-model = mongoose.model 'Article', Article-schema

Article-model.create-article = (title, content, author, category, secret, secret-password, callback)!->
    article = new Article-model {
        title: title,
        author: author,
        content: content,
        secret: secret,
        secret-password: secret-password,
        comments: []
    }
    article.save callback

Article-model.add-comment = (id, comment, callback)!->
    Article-model.find {_id: id}, (err, article)!->
        if article
            article.comments.push comment
            article.save callback
        else
            callback(1)

Article-model.find-index = (callback)!->
    Article-model.find {} .sort {'create-at': 1} .select('title author createAt').exec callback

Article-model.find-by-id (id, callback)!->
    Article-model.find-one {_id: id} .exec callback

Article-model.find-by-category = (author, category, callback)!->
    Article-model.find {'category': category, 'author': author} .sort {'create-at': 1} .exec callback

Article-model.updateContent = (id, content, callback)!->
    Article-model.find-one {_id: id}, (err, article)!->
        if article
            article.content = content
            article.save !->
                callback!
        else
            callback 1, null

Article-model.add-comment = (content, commentor, callback)!->
    Article-model.find-one {_id: id}, (err, article)!->
        if err
            callback(1, null)
        else
            if article
                Comment.add-comment content, commentor, null, callback, (err, comment)!->
                article.comments.push comment
                callback 0, comment
            else
                callback 1, null

Article-model.get-comments = (id, callback)!->
    Article-model.find-one {_id, id}, (err, article)!->
        if err
            callback(1, null)
        else
            if article
                article.aggregate().unwind('comments').sort({"comment-at":1})
                    .group({_id: '$_id', comments: {$push: '$coments'}}).exec()
                    .then ((article)->
                        return Article-model.populate(article, [{path: 'comments.commentor', select: 'name'},
                        {path: 'comments.reply-to', select: 'name'}])
                    ).then ((article)->
                        callback(0, article.comments)
                    )
            else
                callback 1, null

Article-model.drop = (id, callback)!->
    Article-model.remove {_id: id}, callback

module.exports = Article-model
