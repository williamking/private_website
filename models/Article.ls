require ['mongoose']

Object-id = Schema.Types.Object-id

Article-schema = new article.Schema {
    title: String
    create-at: Date,
    last-edit-at: Date,
    content: String,
    category: String,
    secret: Boolean,
    comments: [Object-id]
}

Article-model = mongoose.model 'Article', Article-model

Article-model.updateContent = (id, content, callback)!->
    Article.find-one {_id: id}, (err, article)!->
        if article
            article.content = content
            article.save !->
                callback!
        else
            callback 1, null

Article-model.get-comments = (id, callback)!->
    Article.find-one {_id, id}, (err, article)!->
        if article
            comments = article.comments
            callback null, comments
        else
            callback 1, null

