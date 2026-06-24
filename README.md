# ShopEZ — Shop with Ease 🛒

ShopEZ is a clean, minimal e-commerce platform built using the MERN stack (MongoDB, Express, React, and Node.js). It’s designed from the ground up to offer a premium, distraction-free shopping experience with a dark-mode UI, honest pricing (flat 5% GST, no hidden fees), and simple curation to prevent choice fatigue.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Future Improvements](#future-improvements)

## Project Overview

ShopEZ was built to address the clutter and friction of modern e-commerce. Instead of infinite scrolls and manipulative dark patterns, ShopEZ focuses on high-quality curation, a stark and elegant dark UI, and complete billing transparency. 

Key principles behind the project:
*   **Minimalist & Stark Design:** High-contrast layouts, clean typography, and a cohesive dark palette that lets the products shine.
*   **Curation over Clutter:** Filtered categories that help you find what you need quickly.
*   **Transparent Billing:** A flat 5% GST rate clearly itemized at checkout, with free domestic shipping across India on orders over ₹2,000.

## Features

### 👤 Customer Experience
*   **Catalog & Filters:** Browse products by categories (Mobiles, Electronics, Fashion, Sports, Books, Accessories, Home & Kitchen) with instant search.
*   **Sorting Options:** Sort products by default order, price (low-to-high), or price (high-to-low).
*   **Personalized Curation:** A "Recommended for You" panel dynamically curates items based on your shopping habits (e.g., highlighting your most-ordered items or products from your favorite categories).
*   **Shopping Cart:** Add items, manage quantities, and see your subtotals update in real time.
*   **Checkout & Shipping:** A clean shipping form with detailed tax breakdowns.
*   **Customer Profiles:** Access your profile info and review a clean list of past orders.
*   **Toast Alerts:** Fast, non-intrusive UI alerts for cart actions, auth state changes, and updates.

### 🔑 Admin Controls
*   **Analytics Dashboard:** Get a bird's-eye view of store performance, including total products, total orders, pending/delivered statuses, and overall revenue.
*   **Inventory Management (CRUD):** Add, update, and delete products easily via the admin panel.
*   **Order Fulfillment:** Track customer orders and transition statuses from "Pending" to "Delivered" with a single click.
*   **Global Store Settings:** Update the store-wide announcement banner, manage active categories, and tweak settings on the fly.

## Tech Stack

- **Frontend:** React 19, Vite, React Router v7, Axios, Vanilla CSS (custom design tokens)
- **Backend:** Node.js, Express.js v5
- **Database:** MongoDB & Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing

## Installation

Here is how you can set up ShopEZ locally:

### Prerequisites
Make sure you have Node.js (v18+) and MongoDB installed and running on your system.

### 1. Clone the Repo
```bash
git clone https://github.com/karthik762/ShopEZ.git
cd ShopEZ
```

### 2. Set Up the Backend
1. Move to the server directory:
   ```bash
   cd server
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/shopez
   JWT_SECRET=your_secret_key_here
   ```
4. Seed the database with initial products:
   ```bash
   node seedProducts.js
   ```
5. Start the backend:
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

### 3. Set Up the Frontend
1. Move to the client directory:
   ```bash
   cd ../client
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## Screenshots

Here's a look at the ShopEZ interface in action:

| Admin Order Console | Admin Dashboard |
| :---: | :---: |
| ![Admin Order Console](screenshots/manage_orders.png) | ![Admin Dashboard](screenshots/admin_dashboard.png) |
| **Shopping Cart** | **Manage Products CRUD** |
| ![Shopping Cart](screenshots/shopping_cart.png) | ![Manage Products](screenshots/manage_products.png) |
| **Smart Recommendations** | |
| ![Smart Recommendations](screenshots/recommended_for_you.png) | |

*(Note: Save your screenshot PNGs to a `screenshots` folder at the root of the repository to display them here.)*

## Architecture

### Project Layout
```
ShopEZ/
├── client/                 # React frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Navbar, Toast, AdminHeader, etc.
│   │   ├── pages/          # Home, Products, Cart, Checkout, Admin views, etc.
│   │   ├── App.jsx         # App router setup
│   │   ├── index.css       # Core typography, themes, and styles
│   │   └── main.jsx        # App entry point
│   └── package.json
│
├── server/                 # Express backend API
│   ├── controllers/        # Business logic for all routes
│   ├── middleware/         # Auth verification and CORS setup
│   ├── models/             # Mongoose schemas (User, Product, Order, Cart, Admin)
│   ├── routes/             # REST endpoints (auth, products, cart, orders, admin)
│   ├── index.js            # Express server entry point
│   ├── seedProducts.js     # DB initialization script
│   └── package.json
└── README.md
```

### Data Flow
- **Client (React):** Sends API requests to the backend using Axios.
- **Routing (Express):** Receives requests and routes them through the appropriate middlewares (like verifying JWTs for admin pages).
- **Business Logic (Controllers):** Performs database actions via Mongoose schemas.
- **Database (MongoDB):** Stores application state, user accounts, and purchase records.

## Future Improvements

Some ideas for next iterations:
- **Integrated Payments:** Bring in Stripe or Razorpay to support actual checkouts.
- **Cloud-based Media Uploads:** Integrate Cloudinary or AWS S3 so admins can upload product images directly instead of pasting URIs.
- **Interactive Analytics:** Use Recharts or Chart.js to display sales trends and user signups visually.
- **Real-time Order Updates:** Set up WebSockets (Socket.io) to notify users in real time when their order statuses change.
- **Machine Learning Recommendations:** Use cooperative filtering models to offer smarter recommendations based on similar user profiles.
