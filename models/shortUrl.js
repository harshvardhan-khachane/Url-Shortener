const mongoose = require('mongoose')
const shortId = require('shortid')

// // Define the shortUrlSchema
const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  }
});

// Export the ShortUrl model
module.exports = mongoose.model('ShortUrl', shortUrlSchema);
