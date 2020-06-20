const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    fullName: { type: String},
    email: {type: String},
    password: {type: String},
    userId: {type: Number},
    googleId: {type: Number},
    category: [{
    type: Schema.ObjectId,
    ref: 'Category',
    index: true
  }],
});

module.exports = mongoose.model('User', UserSchema);