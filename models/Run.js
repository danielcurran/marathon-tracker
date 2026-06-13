const mongoose = require('mongoose');

const runSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  distance: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 0 },
  type: {
    type: String,
    enum: ['easy', 'tempo', 'interval', 'long_run', 'recovery', 'race', 'rest'],
    required: true
  },
  notes: { type: String, default: '' },
  perceivedEffort: { type: Number, min: 1, max: 10 },
  route: { type: String, default: '' }
}, { timestamps: true });

runSchema.virtual('pace').get(function () {
  if (!this.duration || !this.distance) return null;
  const minPerKm = this.duration / this.distance;
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}:${s.toString().padStart(2, '0')}/km`;
});

runSchema.set('toJSON', { virtuals: true });
runSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Run', runSchema);
