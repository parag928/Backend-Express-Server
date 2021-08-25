const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    dishId:{
        type: Number,
        required: true
    },
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

var Comment = mongoose.model('Comment', commSchema);

module.exports = Comment;