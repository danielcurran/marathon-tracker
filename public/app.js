(function () {
  'use strict';

  let currentDate = new Date();
  let tab = 'runs';

  function str(d) { return d.toISOString().split('T')[0]; }

  function pad(n) { return n.toString().padStart(2, '0'); }

  function todayStr() { return str(new Date()); }

  function showToast(msg, type) {
    type = type || 'info';
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast ' + type;
    el.classList.remove('hidden');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.add('hidden'), 2000);
  }

  function switchTab(name) {
    tab = name;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + name));
    loadData();
  }

  async function api(path, opts) {
    const res = await fetch(path, opts);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function loadSummary() {
    try {
      const data = await api('/api/summary');
      document.getElementById('stat-distance').textContent = data.totalDistance.toFixed(1);
      document.getElementById('stat-runs').textContent = data.runs;
      document.getElementById('stat-cal').textContent = data.calories;
      document.getElementById('stat-water').textContent = data.water;
    } catch (e) { console.error(e); }
  }

  async function loadRuns() {
    const el = document.getElementById('runs-list');
    try {
      const runs = await api('/api/runs?start=' + todayStr());
      if (runs.length === 0) {
        el.innerHTML = '<div class="empty-state">No runs logged today</div>';
        return;
      }
      el.innerHTML = runs.map(r => {
        const pace = r.pace ? '<span class="card-stat">Pace: <span>' + r.pace + '</span></span>' : '';
        return '<div class="card" data-id="' + r._id + '">' +
          '<button class="card-delete" data-id="' + r._id + '" data-type="run">✕</button>' +
          '<div class="card-title">' + r.type.replace('_', ' ') + ' — ' + r.distance.toFixed(2) + ' km</div>' +
          '<div class="card-sub">' + Math.floor(r.duration / 60) + 'h ' + (r.duration % 60) + 'min' + (r.notes ? ' · ' + r.notes : '') + '</div>' +
          '<div class="card-row">' + pace + (r.perceivedEffort ? '<span class="card-stat">RPE: <span>' + r.perceivedEffort + '/10</span></span>' : '') + '</div>' +
        '</div>';
      }).join('');
    } catch (e) { el.innerHTML = '<div class="empty-state">Error loading runs</div>'; }
  }

  async function loadMeals() {
    const el = document.getElementById('meals-list');
    try {
      const meals = await api('/api/meals?start=' + todayStr());
      if (meals.length === 0) {
        el.innerHTML = '<div class="empty-state">No meals logged today</div>';
        return;
      }
      el.innerHTML = meals.map(m =>
        '<div class="card" data-id="' + m._id + '">' +
          '<button class="card-delete" data-id="' + m._id + '" data-type="meal">✕</button>' +
          '<div class="card-title">' + m.type.charAt(0).toUpperCase() + m.type.slice(1) + '</div>' +
          '<div class="card-sub">' + m.description + '</div>' +
          '<div class="card-row">' +
            (m.calories ? '<span class="card-stat">Cal: <span>' + m.calories + '</span></span>' : '') +
            (m.protein ? '<span class="card-stat">Protein: <span>' + m.protein + 'g</span></span>' : '') +
          '</div>' +
        '</div>'
      ).join('');
    } catch (e) { el.innerHTML = '<div class="empty-state">Error loading meals</div>'; }
  }

  async function loadWater() {
    const el = document.getElementById('water-list');
    try {
      const entries = await api('/api/water?start=' + todayStr());
      if (entries.length === 0) {
        el.innerHTML = '<div class="empty-state">No water logged today</div>';
        return;
      }
      const total = entries.reduce((s, e) => s + e.ml, 0);
      el.innerHTML = entries.map(e =>
        '<div class="card" data-id="' + e._id + '">' +
          '<button class="card-delete" data-id="' + e._id + '" data-type="water">✕</button>' +
          '<div class="card-title">' + e.ml + ' ml</div>' +
          '<div class="card-sub">' + new Date(e.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) + '</div>' +
        '</div>'
      ).join('') +
      '<div class="card" style="background:var(--primary-light)"><div class="card-title">Total: <span style="color:var(--primary)">' + total + ' ml</span></div></div>';
    } catch (e) { el.innerHTML = '<div class="empty-state">Error loading water</div>'; }
  }

  function loadData() {
    loadSummary();
    if (tab === 'runs') loadRuns();
    else if (tab === 'nutrition') loadMeals();
    else if (tab === 'water') loadWater();
  }

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Today button
  document.getElementById('today-btn').addEventListener('click', () => { currentDate = new Date(); loadData(); });

  // Add run
  document.getElementById('add-run-btn').addEventListener('click', () => {
    document.getElementById('run-date').value = todayStr();
    document.getElementById('run-distance').value = '';
    document.getElementById('run-duration').value = '';
    document.getElementById('run-type').value = 'easy';
    document.getElementById('run-effort').value = '';
    document.getElementById('run-notes').value = '';
    document.getElementById('run-modal').classList.remove('hidden');
  });

  document.getElementById('run-cancel').addEventListener('click', () => document.getElementById('run-modal').classList.add('hidden'));

  document.getElementById('run-save').addEventListener('click', async () => {
    try {
      await api('/api/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: document.getElementById('run-date').value,
          distance: parseFloat(document.getElementById('run-distance').value) || 0,
          duration: parseFloat(document.getElementById('run-duration').value) || 0,
          type: document.getElementById('run-type').value,
          perceivedEffort: parseInt(document.getElementById('run-effort').value) || undefined,
          notes: document.getElementById('run-notes').value
        })
      });
      document.getElementById('run-modal').classList.add('hidden');
      showToast('Run saved!', 'success');
      loadData();
    } catch (e) { showToast('Error saving run', 'error'); }
  });

  // Add meal
  document.getElementById('add-meal-btn').addEventListener('click', () => {
    document.getElementById('meal-date').value = todayStr();
    document.getElementById('meal-type').value = 'breakfast';
    document.getElementById('meal-desc').value = '';
    document.getElementById('meal-cal').value = '';
    document.getElementById('meal-protein').value = '';
    document.getElementById('meal-modal').classList.remove('hidden');
  });

  document.getElementById('meal-cancel').addEventListener('click', () => document.getElementById('meal-modal').classList.add('hidden'));

  document.getElementById('meal-save').addEventListener('click', async () => {
    try {
      await api('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: document.getElementById('meal-date').value,
          type: document.getElementById('meal-type').value,
          description: document.getElementById('meal-desc').value,
          calories: parseFloat(document.getElementById('meal-cal').value) || 0,
          protein: parseFloat(document.getElementById('meal-protein').value) || 0
        })
      });
      document.getElementById('meal-modal').classList.add('hidden');
      showToast('Meal saved!', 'success');
      loadData();
    } catch (e) { showToast('Error saving meal', 'error'); }
  });

  // Add water
  document.getElementById('add-water-btn').addEventListener('click', () => {
    document.getElementById('water-date').value = todayStr();
    document.getElementById('water-ml').value = '';
    document.getElementById('water-modal').classList.remove('hidden');
  });

  document.getElementById('water-cancel').addEventListener('click', () => document.getElementById('water-modal').classList.add('hidden'));

  document.getElementById('water-save').addEventListener('click', async () => {
    try {
      await api('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: document.getElementById('water-date').value,
          ml: parseFloat(document.getElementById('water-ml').value) || 0
        })
      });
      document.getElementById('water-modal').classList.add('hidden');
      showToast('Water logged!', 'success');
      loadData();
    } catch (e) { showToast('Error logging water', 'error'); }
  });

  // Quick water buttons
  document.querySelectorAll('.quick-water-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('water-ml').value = parseInt(btn.dataset.ml);
    });
  });

  // Delete items (event delegation)
  document.addEventListener('click', async function(e) {
    const del = e.target.closest('.card-delete');
    if (!del) return;
    const id = del.dataset.id;
    const type = del.dataset.type;
    try {
      await api('/api/' + type + 's/' + id, { method: 'DELETE' });
      showToast('Deleted', 'info');
      loadData();
    } catch (e) { showToast('Error deleting', 'error'); }
  });

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', function(e) { if (e.target === this) this.classList.add('hidden'); });
  });

  loadData();
})();
