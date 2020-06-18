const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    index: true
  },
  categoryName: {
    type: String,
    required: true
  },
   content: [{
    type: Schema.ObjectId,
    ref: 'Content',
    index: true
  }]
});

module.exports = mongoose.model('Category', CategorySchema);
