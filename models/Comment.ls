require! ['mongoose']

Object-id = Schema.Types.Object-id

Comment-schema = new mongoose.Schema {
    author: name,
    author-id: Object-id,
    content: String,
    create-at: Date,
    replys: [Object-id]
}

Comment-model = mongoose.model 'Comment', Comment-schema


Comment-model.get-replys = (id, callback)!->
    Comment-model.find {_id: id}, (err, replys)!->
        if replys
            callback null, replys
        else
            callback 1, null

