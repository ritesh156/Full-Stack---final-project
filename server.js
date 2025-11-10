const express = require('express');
const app = express();

app.get('/features', (req, res) => {
  const q = req.query.q || '';
  const sql = q
    ? 'SELECT * FROM features WHERE name LIKE ? ORDER BY ts DESC'
    : 'SELECT * FROM features ORDER BY ts DESC LIMIT 100';
  const params = q ? [`%${q}%`] : [];

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/features/:id', (req, res) => {
  db.get('SELECT * FROM features WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  });
});

app.post('/features', (req, res) => {
  const { name, value, entity_id, ts } = req.body;
  const time = ts || Date.now();

  db.run(
    'INSERT INTO features (name, value, entity_id, ts) VALUES (?, ?, ?, ?)',
    [name, String(value), entity_id || '', time],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.get('SELECT * FROM features WHERE id = ?', [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.status(201).json(row);
      });
    }
  );
});

app.put('/features/:id', (req, res) => {
  const { name, value, entity_id, ts } = req.body;
  const time = ts || Date.now();

  db.run(
    'UPDATE features SET name = ?, value = ?, entity_id = ?, ts = ? WHERE id = ?',
    [name, String(value), entity_id || '', time, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'not found' });

      db.get('SELECT * FROM features WHERE id = ?', [req.params.id], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(row);
      });
    }
  );
});

app.delete('/features/:id', (req, res) => {
  db.run('DELETE FROM features WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'not found' });
    res.json({ deleted: true });
  });
});

app.post('/features/batch', (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [];
  const stmt = db.prepare('INSERT INTO features (name, value, entity_id, ts) VALUES (?, ?, ?, ?)');
  db.serialize(() => {
    for (const it of items) {
      const time = it.ts || Date.now();
      stmt.run(it.name, String(it.value), it.entity_id || '', time);
    }
    stmt.finalize(() => {
      res.json({ ingested: items.length });
    });
  });
});

app.get('/query', (req, res) => {
  const entity = req.query.entity_id || '';
  if (!entity) return res.status(400).json({ error: 'entity_id required' });

  db.all(
    'SELECT name, value, ts FROM features WHERE entity_id = ? ORDER BY ts DESC',
    [entity],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const result = {};
      for (const r of rows) {
        if (!(r.name in result)) result[r.name] = r.value;
      }

      res.json({ entity_id: entity, features: result });
    }
  );
});

const port = process.env.PORT || 4000;
app.listen(port, () => {});
