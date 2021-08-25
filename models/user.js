var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    username: {
      type: String,
        default: ''
    },
    password: {
      type: String,
        default: ''
    },
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    //facebookId: String,
    admin:  {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);
module.exports = User;