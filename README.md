
# 🍔 Food Delivery App

A full-stack food delivery application with a **React Native (Expo)** frontend and a **Node.js + Express** backend using **SQLite**.

---

## 📁 Project Structure

```
food-delivery-app/
├── frontend/                    # React Native App (Expo)
│   ├── App.js                   # Entry point + navigation
│   ├── screens/
│   │   ├── HomeScreen.js        # Restaurant list with search & filter
│   │   └── RestaurantDetail.js  # Restaurant menu + cart
│   ├── components/
│   │   ├── RestaurantCard.js    # Reusable restaurant UI card
│   │   └── Header.js            # App header / search bar
│   ├── services/
│   │   └── api.js               # Axios API service layer
│   └── package.json
│
├── backend/                     # Node.js + Express
│   ├── server.js                # Main server + DB init + seeding
│   ├── routes.js                # API routes
│   ├── controllers.js           # Route handler logic
│   ├── database.js              # SQLite connection
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
node server.js
# Server runs on http://localhost:5000
```

The database (`database.db`) is created automatically with seeded restaurant and menu data on first run.

### 2. Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

> **Important**: In `frontend/services/api.js`, update `BASE_URL`:
> - iOS Simulator: `http://localhost:5000/api`
> - Android Emulator: `http://10.0.2.2:5000/api`
> - Physical device: `http://<your-machine-ip>:5000/api`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants` | Get all restaurants (supports `?search=&cuisine=&open=`) |
| GET | `/api/restaurants/:id` | Get a single restaurant |
| GET | `/api/restaurants/:id/menu` | Get menu items (supports `?category=`) |
| GET | `/api/cuisines` | Get all cuisine types |

---

## ✨ Features

- 🔍 Search restaurants by name or cuisine
- 🏷️ Filter by cuisine category
- ⭐ Restaurant ratings and delivery info
- 📋 Grouped menu by category
- 🛒 Add/remove items to cart
- 🔄 Pull-to-refresh
- ❌ Error & empty states handled gracefully
- 🔒 Closed restaurant indicator

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React Native, Expo, React Navigation |
| State | React Hooks (useState, useEffect, useCallback) |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| Database | SQLite (via sqlite3) |
| ORM | Raw SQL with sqlite3 |


