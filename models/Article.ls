require ['mongoose']

Object-id = Schema.Types.Object-id

Article-schema = new mongoose.Schema {
    title: {
        type: 'String',
        required: true
    },
    create-at: Date,
    author: {
        type: 'String',
        required: true
    },
    author-id: Object-id,
    last-edit-at: Date,
    content: String,
    category: [String],
    secret: Boolean,
    secret-password: {
       type: 'String',
       require: true
    },
    comments: [Object-id]
}

Article-model = mongoose.model 'Article', Article-model

Article-model.updateContent = (id, content, callback)!->
    Article-model.find-one {_id: id}, (err, article)!->
        if article
            article.content = content
            article.save !->
                callback!
        else
            callback 1, null

Article-model.get-comments = (id, callback)!->
    Article-model.find-one {_id, id}, (err, article)!->
        if err
            callback(1, null)
        else
            if article
                article.aggregate().unwind('')
                callback null, comments
            else
                callback 1, null
