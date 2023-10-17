const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
