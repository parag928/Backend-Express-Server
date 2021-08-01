var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Favorite = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{type: mongoose.Schema.Types.ObjectId,
        ref: 'Dishes'}]
}, {
    timestamps: true
});

Favorite.plugin(passportLocalMongoose);
module.exports = mongoose.model('Favorite', Favorite);