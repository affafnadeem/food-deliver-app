const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database tables and seed data
db.serialize(() => {
  // Drop and recreate to ensure fresh seed data for the demo
  db.run('DROP TABLE IF EXISTS menu_items');
  db.run('DROP TABLE IF EXISTS restaurants');

  db.run(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cuisine TEXT NOT NULL,
      rating REAL DEFAULT 0,
      delivery_time TEXT NOT NULL,
      delivery_fee REAL DEFAULT 0,
      min_order REAL DEFAULT 0,
      image_url TEXT,
      address TEXT,
      is_open INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      image_url TEXT,
      is_available INTEGER DEFAULT 1,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    )
  `);

  // Seed restaurants
  const restaurants = [
    ['The Burger Joint', 'Burgers', 4.8, '15-25 min', 0, 10, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000', '123 Burger St', 1],
    ['Artisanal Pizza Co', 'Pizza', 4.9, '20-35 min', 2.99, 15, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000', '456 Pizza Ave', 1],
    ['Sakura Sushi', 'Sushi', 4.7, '30-45 min', 4.99, 25, 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000', '789 Sushi Rd', 1],
    ['Taco House', 'Tacos', 4.6, '15-20 min', 1.49, 12, 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1000', '321 Taco Ln', 1],
    ['Dragon Bowl', 'Chinese', 4.5, '25-40 min', 3.49, 15, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000', '654 China Dr', 1],
    ['Green Garden', 'Healthy', 4.8, '20-30 min', 0, 18, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000', '987 Green Blvd', 1],
    ['Spice of India', 'Indian', 4.9, '35-50 min', 3.99, 20, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1000', '111 Curry St', 1],
    ['Thai Orchid', 'Thai', 4.8, '30-45 min', 2.99, 15, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000', '222 Thai Ave', 1],
    ['Sugar Bliss', 'Desserts', 4.9, '10-15 min', 0.99, 5, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000', '333 Sugar St', 1],
    ['Grill House', 'Burgers', 4.7, '20-30 min', 3.99, 12, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000', '444 Patty Rd', 1],
    ['Pizzeria Napoli', 'Pizza', 4.8, '25-40 min', 1.99, 10, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000', '555 Slice Cir', 1],
    ['Fresh Express', 'Healthy', 4.6, '15-25 min', 0.99, 5, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000', '666 Fresh Ln', 1],
  ];

  const restStmt = db.prepare('INSERT INTO restaurants (name, cuisine, rating, delivery_time, delivery_fee, min_order, image_url, address, is_open) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  restaurants.forEach(r => restStmt.run(r));
  restStmt.finalize();

  // Seed menu items
  const items = [
    // The Burger Joint (1)
    [1, 'Signature Whopper', 'Premium Wagyu beef, truffle mayo, aged cheddar', 12.99, 'Main', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600', 1],
    [1, 'Crispy Chicken Burger', 'Buttermilk fried chicken, spicy slaw, honey mustard', 10.99, 'Main', 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=600', 1],
    [1, 'Truffle Fries', 'Golden cut fries drizzled with white truffle oil', 6.99, 'Sides', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600', 1],
    // Artisanal Pizza Co (2)
    [2, 'Burrata Pizza', 'Creamy burrata, prosciutto, wild arugula', 18.99, 'Pizza', 'https://images.unsplash.com/photo-1574129623262-9578f71efdd1?q=80&w=600', 1],
    [2, 'Wild Mushroom', 'Truffle oil, roasted mushrooms, fresh thyme', 16.99, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600', 1],
    [2, 'Garlic Knots', 'Hand-knotted dough with herbs and garlic', 7.99, 'Sides', 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?q=80&w=600', 1],
    // Sakura Sushi (3)
    [3, 'OMAKASE Set', 'Chef selection of 12 premium nigiri', 34.99, 'Sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600', 1],
    [3, 'Tuna Carpaccio', 'Thinly sliced Bluefin tuna with citrus ponzu', 18.99, 'Appetizer', 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600', 1],
    [3, 'Matcha Cheesecake', 'Velvety matcha infused Japanese cheesecake', 9.99, 'Dessert', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600', 1],
    // Taco House (4)
    [4, 'Al Pastor Tacos', 'Marinated pork with pineapple and salsa verde', 11.99, 'Tacos', 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=600', 1],
    [4, 'Street Corn', 'Grilled corn with cotija cheese and lime', 5.99, 'Sides', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600', 1],
    // Dragon Bowl (5)
    [5, 'Peking Duck', 'Traditional crispy duck with hoisin sauce', 24.99, 'Main', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600', 1],
    [5, 'Dim Sum Platter', 'Assortment of handmade prawns and pork dumplings', 14.99, 'Sides', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=600', 1],
    // Spice of India (7)
    [7, 'Lamb Rogan Josh', 'Slow-cooked lamb with aromatic spices', 18.99, 'Curry', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600', 1],
    [7, 'Malai Kofta', 'Potato and cheese dumplings in creamy sauce', 15.99, 'Curry', 'https://images.unsplash.com/photo-1601050633647-81a3dd0460a1?q=80&w=600', 1],
    // Thai Orchid (8)
    [8, 'Pineapple Fried Rice', 'Jasmine rice with shrimp, cashews, and raisins', 16.99, 'Main', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600', 1],
    [8, 'Tom Yum Soup', 'Spicy and sour soup with lemongrass and prawns', 12.99, 'Appetizer', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=600', 1],
    // Sugar Bliss (9)
    [9, 'Tiramisu', 'Classic Italian dessert with espresso and mascarpone', 8.99, 'Dessert', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=600', 1],
    [9, 'Macaron Set', 'Box of 6 handmade French macarons', 14.99, 'Dessert', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600', 1],
  ];

  const itemStmt = db.prepare('INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?, ?)');
  items.forEach(i => itemStmt.run(i));
  itemStmt.finalize();

});

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
