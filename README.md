
# 🍔 Food Delivery App

> A full-stack food delivery application with a **React Native (Expo)** frontend and a **Node.js + Express** backend using **SQLite**.

![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat&logo=sqlite)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-orange?style=flat)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## 📸 Screenshots









### Home Screen
<img width="959" height="441" alt="Screenshot 2026-04-18 003416" src="https://github.com/user-attachments/assets/ee0e7e8f-b80a-4a57-babb-471fbf5855b3" />
<img width="959" height="439" alt="Screenshot 2026-04-18 003442" src="https://github.com/user-attachments/assets/917bb083-b02e-46b2-9dbe-658bef2bc456" />
<img width="959" height="437" alt="Screenshot 2026-04-18 003513" src="https://github.com/user-attachments/assets/8654ac1c-50b2-425d-82da-3fde7acd8c02" />
<img width="959" height="434" alt="Screenshot 2026-04-18 003540" src="https://github.com/user-attachments/assets/08c75f4a-29ed-4579-8c7b-eda39cdd340a" />
<img width="959" height="441" alt="Screenshot 2026-04-18 003616" src="https://github.com/user-attachments/assets/ccf7a170-a833-4274-84a3-73238d42ea97" />
<img width="959" height="440" alt="Screenshot 2026-04-18 003646" src="https://github.com/user-attachments/assets/e63b3665-8e44-4c29-9727-e90a723a7418" />

### Restaurant Detail
<img width="959" height="440" alt="Screenshot 2026-04-18 003725" src="https://github.com/user-attachments/assets/16cd4c61-19bc-43ff-88b7-d04f3da73c1c" />


### Cart
<img width="958" height="440" alt="Screenshot 2026-04-18 003749" src="https://github.com/user-attachments/assets/0f41334d-76f3-4ff3-871d-97e678aadaf4" />
<img width="955" height="442" alt="Screenshot 2026-04-18 004127" src="https://github.com/user-attachments/assets/76fd35c3-ce50-46f9-8b2f-ca8444335238" />

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

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | React Native, Expo, React Navigation            |
| State       | React Hooks (useState, useEffect, useCallback)  |
| HTTP Client | Axios                                           |
| Backend     | Node.js, Express                                |
| Database    | SQLite (via sqlite3)                            |
| ORM         | Raw SQL with sqlite3                            |

---

## 📁 Project Structure

```
food-delivery-app/
├── backend/
│ ├── controllers.js # Route handler logic
│ ├── database.db # Auto-generated SQLite database
│ ├── database.js # SQLite connection
│ ├── routes.js # API routes
│ ├── server.js # Main server + DB init + seeding
│ ├── package-lock.json
│ └── package.json
│
├── frontend/
│ ├── .expo/ # Expo config cache
│ ├── components/ # Reusable UI components
│ ├── screens/ # App screens
│ ├── services/ # Axios API service layer
│ ├── App.js # Entry point + navigation
│ ├── app.json # Expo app config
│ ├── package-lock.json
│ └── package.json
│
├── .gitignore
├── package.json # Root scripts
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v16+)
- Expo CLI installed globally
- iOS Simulator / Android Emulator **or** Expo Go app on your phone

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/food-delivery-app.git
cd food-delivery-app
```

### 2. Backend Setup

```bash
cd backend
npm install
node server.js
```

> 🚀 Server runs on `http://localhost:5000`
> The database (`database.db`) is created **automatically** with seeded restaurant and menu data on first run.

### 3. Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

Then scan the QR code with **Expo Go** on your phone, or press:
- `a` → Open on Android Emulator
- `i` → Open on iOS Simulator

### ⚠️ Important — Update BASE_URL

In `frontend/services/api.js`, update `BASE_URL` based on your environment:

| Environment      | BASE_URL                              |
|------------------|---------------------------------------|
| iOS Simulator    | `http://localhost:5000/api`           |
| Android Emulator | `http://10.0.2.2:5000/api`            |
| Physical Device  | `http://<your-machine-ip>:5000/api`   |

---

## 📡 API Endpoints

| Method | Endpoint                    | Description                                       |
|--------|-----------------------------|---------------------------------------------------|
| GET    | `/api/restaurants`          | Get all restaurants (`?search=&cuisine=&open=`)   |
| GET    | `/api/restaurants/:id`      | Get a single restaurant                           |
| GET    | `/api/restaurants/:id/menu` | Get menu items (`?category=`)                     |
| GET    | `/api/cuisines`             | Get all cuisine types                             |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you\'d like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

⭐ If you found this useful, give it a star!
