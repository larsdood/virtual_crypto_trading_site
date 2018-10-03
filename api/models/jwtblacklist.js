const mongoose = require('mongoose');

const blacklistSchema = mongoose.Schema({
  tokens: [{
    token: String,
    exp: Number,
  }],
});

module.exports = mongoose.model('Blacklist', blacklistSchema);

const Blacklist = module.exports;
