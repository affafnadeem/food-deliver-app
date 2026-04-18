const db = require('./database');

// GET all restaurants (with optional search and filter)
const getRestaurants = (req, res) => {
  const { search, cuisine, open } = req.query;
  let query = 'SELECT * FROM restaurants WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR cuisine LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (cuisine) {
    query += ' AND cuisine = ?';
    params.push(cuisine);
  }
  if (open !== undefined) {
    query += ' AND is_open = ?';
    params.push(open === 'true' ? 1 : 0);
  }
  query += ' ORDER BY rating DESC';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows, count: rows.length });
  });
};

// GET single restaurant by ID
const getRestaurantById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM restaurants WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Restaurant not found' });
    res.json({ success: true, data: row });
  });
};

// GET menu items for a restaurant
const getMenuByRestaurant = (req, res) => {
  const { id } = req.params;
  const { category } = req.query;
  let query = 'SELECT * FROM menu_items WHERE restaurant_id = ?';
  const params = [id];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  query += ' ORDER BY category, name';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Group items by category
    const grouped = rows.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({ success: true, data: rows, grouped, count: rows.length });
  });
};

// GET all cuisines (for filter)
const getCuisines = (req, res) => {
  db.all('SELECT DISTINCT cuisine FROM restaurants ORDER BY cuisine', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows.map(r => r.cuisine) });
  });
};

module.exports = { getRestaurants, getRestaurantById, getMenuByRestaurant, getCuisines };
