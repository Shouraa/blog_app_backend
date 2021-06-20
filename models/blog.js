const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  message: String,
  name: String,
  author: String,
  tags: [String],
  imgFile: String,
  likeCount: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
