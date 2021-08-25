var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'}]
}, {
    timestamps: true
});

var Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
