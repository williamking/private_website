require! ['mongoose']

Object-id = mongoose.Schema.Types.Object-id

Comment-schema = new mongoose.Schema {
    content: String,
    commentor: String,
    comment-at: { type: Date, default: Date.now }
    reply-to : { type: Object-id, default: null }
}

Comment-model = mongoose.model 'Comment', Comment-schema

Comment-model.add-comment = (content, commentor, reply-to, callback)!->
    if reply-to isnt null
        new-comment = new Comment-model {
            content: content,
            commentor: commentor,
            reply-to: reply-to
        }
    else
        new-comment = new Comment-model {
            content: content,
            commentor: commentor
        }
    console.log callback
    func = (callback, new-comment)->
        return (err)!->
            if err
                callback err
            else
                callback null, new-comment
    func2 = func callback, new-comment
    new-comment.save func2


Comment-model.find-by-id (id, callback)!->
    Comment-model.find-one {_id: id}, callback

module.exports = Comment-model
