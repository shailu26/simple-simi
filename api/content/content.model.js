const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ContentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  fileLink: {
    type: String,
    required: true
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category',
    index: true
  },
});

module.exports = mongoose.model('Content', ContentSchema);
