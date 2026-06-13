const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  ml: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Water', waterSchema);
