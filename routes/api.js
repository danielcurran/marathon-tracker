const express = require('express');
const router = express.Router();
const Run = require('../models/Run');
const Meal = require('../models/Meal');
const Water = require('../models/Water');

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

router.get('/runs', async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = startOfDay(new Date(start));
      if (end) filter.date.$lte = endOfDay(new Date(end));
    }
    const runs = await Run.find(filter).sort({ date: -1 });
    res.json(runs);
  } catch (err) {
    console.error('GET /runs error:', err);
    res.status(500).json({ error: 'Failed to load runs' });
  }
});

router.post('/runs', async (req, res) => {
  try {
    const run = await Run.create(req.body);
    res.json(run);
  } catch (err) {
    console.error('POST /runs error:', err);
    res.status(500).json({ error: 'Failed to save run' });
  }
});

router.delete('/runs/:id', async (req, res) => {
  try {
    await Run.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /runs error:', err);
    res.status(500).json({ error: 'Failed to delete run' });
  }
});

router.get('/meals', async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = startOfDay(new Date(start));
      if (end) filter.date.$lte = endOfDay(new Date(end));
    }
    const meals = await Meal.find(filter).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    console.error('GET /meals error:', err);
    res.status(500).json({ error: 'Failed to load meals' });
  }
});

router.post('/meals', async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.json(meal);
  } catch (err) {
    console.error('POST /meals error:', err);
    res.status(500).json({ error: 'Failed to save meal' });
  }
});

router.delete('/meals/:id', async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /meals error:', err);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

router.get('/water', async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = startOfDay(new Date(start));
      if (end) filter.date.$lte = endOfDay(new Date(end));
    }
    const entries = await Water.find(filter).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error('GET /water error:', err);
    res.status(500).json({ error: 'Failed to load water entries' });
  }
});

router.post('/water', async (req, res) => {
  try {
    const entry = await Water.create(req.body);
    res.json(entry);
  } catch (err) {
    console.error('POST /water error:', err);
    res.status(500).json({ error: 'Failed to save water entry' });
  }
});

router.delete('/water/:id', async (req, res) => {
  try {
    await Water.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /water error:', err);
    res.status(500).json({ error: 'Failed to delete water entry' });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = start ? new Date(start) : new Date();
    const endDate = end ? new Date(end) : new Date();
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);

    const runs = await Run.find({ date: { $gte: startDate, $lte: endDate } });
    const meals = await Meal.find({ date: { $gte: startDate, $lte: endDate } });
    const water = await Water.find({ date: { $gte: startDate, $lte: endDate } });

    const totalDistance = runs.reduce((s, r) => s + r.distance, 0);
    const totalDuration = runs.reduce((s, r) => s + r.duration, 0);
    const totalCalories = meals.reduce((s, m) => s + (m.calories || 0), 0);
    const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);
    const totalWater = water.reduce((s, w) => s + w.ml, 0);

    res.json({
      runs: runs.length,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalDuration,
      calories: totalCalories,
      protein: totalProtein,
      water: totalWater,
      avgPace: runs.length > 0 && totalDistance > 0
        ? Math.round(totalDuration / totalDistance * 100) / 100
        : null
    });
  } catch (err) {
    console.error('GET /summary error:', err);
    res.status(500).json({ error: 'Failed to load summary' });
  }
});

module.exports = router;
