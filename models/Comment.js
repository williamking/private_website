const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const CommentSchema = new mongoose.Schema({
    content: { type:String, require: true },
    commentor: String,
    commentAt: { type: Date, default: Date.now },
    reply: { type: String, default: '' },
    repliedAt: { type: Date }
});

const CommentModel = mongoose.model('Comment', CommentSchema);

CommentModel.create = (obj, callback) => {
    let newComment;
    newComment = new CommentModel(obj);
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

module.exports = {
    model: CommentModel,
    schema: CommentSchema
};
