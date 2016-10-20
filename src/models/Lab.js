const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
    name: {
    	type: String,
    	unique: true
    },
    description: {
    	type: String
    }
});

const Lab = mongoose.model('Lab', LabSchema);

Lab.add = (name, callback) => {
    Lab.create({ name }, callback);
};

module.exports = Lab;