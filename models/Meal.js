const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  description: { type: String, required: true },
  calories: { type: Number, default: 0, min: 0 },
  protein: { type: Number, default: 0, min: 0 },
  carbs: { type: Number, default: 0, min: 0 },
  fat: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

mealSchema.set('toJSON', { virtuals: true });
mealSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Meal', mealSchema);
