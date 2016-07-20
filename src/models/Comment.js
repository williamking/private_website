const mongoose = require('mongoose');

ObjectId = mongoose.Schema.Types.ObjectId

CommentSchema = new mongoose.Schema({
    content: String,
    commentor: String,
    commentAt: { type: Date, default: Date.now },
    replyTo : { type: ObjectId, default: null }
});

CommentModel = mongoose.model('Comment', CommentSchema);

CommentModel.addComment = (content, commentor, replyTo, callback) => {
    let newComment;
    if (replyTo != null) {
        newComment = new CommentModel ({
            content: content,
            commentor: commentor,
            replyTo: replyTo
        });
    }
    else {
        newComment = new CommentModel ({
            content: content,
            commentor: commentor
        });
    }
    let func = (callback, newComment) => {
        return (err) => {
            if (err)
                callback(err);
            else
                callback(null, newComment);
        }
    }
    let func2 = func(callback, newComment);
    newComment.save(func2);
};

CommentModel.findById = (id, callback) => {
    CommentModel.findOne({_id: id}, callback);
};

module.exports = CommentModel();
