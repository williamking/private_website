Comment-schema = new mongoose.Schema {
    content: String,
    commentor: String,
    comment-at: { type: Date, default: Date.now }
    reply-to : Object-id
}

Comment-model = mongoose.model 'Comment', Comment-schema

Comment-model.add-comment = (content, commentor, reply-to, callback)!->
    new-comment = new Comment-model {
        content: content,
        commentor: commentor,
        reply-to: reply-to
    }
    new-comment.save callback

Comment-model.find-by-id (id, callback)!->
    Comment-model.find-one {_id: id}, callback

module.exports = Comment-model
