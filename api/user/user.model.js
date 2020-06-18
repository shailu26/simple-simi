const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    fullName: { type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    userId: {type: Number, required: true},
    category: [{
    type: Schema.ObjectId,
    ref: 'Category',
    index: true
  }],
});

module.exports = mongoose.model('User', UserSchema);