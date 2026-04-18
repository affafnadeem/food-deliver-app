const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, getMenuByRestaurant, getCuisines } = require('./controllers');

// Restaurant routes
router.get('/restaurants', getRestaurants);           // GET /api/restaurants?search=&cuisine=&open=
router.get('/restaurants/:id', getRestaurantById);    // GET /api/restaurants/:id
router.get('/restaurants/:id/menu', getMenuByRestaurant); // GET /api/restaurants/:id/menu?category=
router.get('/cuisines', getCuisines);                 // GET /api/cuisines

module.exports = router;
