# ShopEZ — Shop With Ease 🛒

ShopEZ is a premium, minimalist, and high-performance e-commerce platform built on the **MERN (MongoDB, Express, React, Node.js)** stack. Grounded in transparency and stark usability, ShopEZ offers direct product catalog sourcing, clean flat-rate GST billing, and a custom recommendation engine designed to eliminate choice fatigue.

---

## ├── Project Overview

ShopEZ is designed for users seeking a streamlined, premium shopping experience without algorithmic noise or hidden checkout fees. It integrates an elegant dark-themed UI built using modern design tokens with a robust, secured backend API to handle catalogs, order processing, and administrative controls.

### Core Philosophies:
*   **Stark Utility:** Asymmetric, responsive layouts focusing entirely on premium goods with zero fillers.
*   **Zero Choice Fatigue:** Direct catalog categories and personalized product highlights.
*   **Billing Transparency:** Clear 5% GST itemization and flat domestic shipping rules.

---

## ├── Features

### 👤 Customer Experience
*   **Curated Product Catalog:** Filter items instantly by categories (Mobiles, Electronics, Fashion, Sports, Books, etc.) and search dynamically.
*   **Flexible Sorting:** Arrange products instantly by default, price low-to-high, or price high-to-low.
*   **Smart Recommendations:** An interest-based curation card ("Recommended for You") suggesting your most-ordered items and similar items from your highest-purchased categories.
*   **Interactive Shopping Cart:** Real-time quantity adjustments, live pricing tallies, and clean, persistent cart storage.
*   **Stark Checkout:** Simple shipping details form with clear billing itemization (subtotal, flat 5% GST, and free shipping on orders above ₹2,000).
*   **User Dashboard:** Interactive profiles displaying customer details alongside a chronological order history.
*   **Toast Notifications:** Real-time UI feedback for actions like cart updates and authentication.

### 🔑 Administrative Control
*   **Admin Analytics Dashboard:** Live business counters showing Total Products, Total Orders, Pending Orders, Delivered Orders, and Total Revenue.
*   **Product CRUD Manager:** Add, edit, or delete items instantly with forms specifying name, price, stock, category, and image URI.
*   **Order Fulfillment Console:** Transition customer orders from "Pending" to "Delivered" and view detailed buyer shipping addresses.
*   **Global Settings Panel:** Dynamically update the shop banner message, configure product categories, and manage tax parameters.

---

## ├── Tech Stack

| Layer | Technology | Key Libraries / Frameworks |
| :--- | :--- | :--- |
| **Frontend** | React 19, HTML5, Vanilla CSS | `react-router-dom` (v7), `axios` |
| **Backend** | Node.js, Express.js (v5) | `cors`, `dotenv` |
| **Database** | MongoDB | `mongoose` (ODM) |
| **Security** | JWT, bcryptjs | `jsonwebtoken`, `bcryptjs` |
| **Build/Dev Tooling** | Vite (v8) | `nodemon` (Hot Reloading), `eslint` |

---

## ├── Installation

Follow these steps to run ShopEZ locally on your machine.

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Instance (Local database or MongoDB Atlas cloud cluster URI)

### 1. Clone & Set Up the Repository
```bash
git clone https://github.com/karthik762/ShopEZ.git
cd ShopEZ
```

### 2. Configure Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your configurations:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/shopez
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Seed initial products to populate the store:
   ```bash
   node seedProducts.js
   ```
5. Launch the backend server:
   ```bash
   # For production
   npm start
   
   # For development (with nodemon auto-restart)
   npm run dev
   ```

### 3. Configure Frontend Client
1. Navigate to the client folder (from the project root):
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173` (or the port specified by Vite).

---

## ├── Screenshots

Below are snapshots of the ShopEZ platform:

| Admin Order Console | Admin Dashboard |
| :---: | :---: |
| ![Admin Order Console](screenshots/manage_orders.png) | ![Admin Dashboard](screenshots/admin_dashboard.png) |
| **Shopping Cart** | **Manage Products CRUD** |
| ![Shopping Cart](screenshots/shopping_cart.png) | ![Manage Products](screenshots/manage_products.png) |
| **Smart Recommendations** | |
| ![Smart Recommendations](screenshots/recommended_for_you.png) | |

*(Note: Save your screenshot PNGs to a `screenshots` folder at the root of the repository to display them here.)*

---

## ├── Architecture

### Directory Layout
```
ShopEZ/
├── client/                 # React frontend application
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # App asset files
│   │   ├── components/     # Reusable layout components (Navbar, Toast, AdminHeader)
│   │   ├── pages/          # View screens (Home, Products, Checkout, Admin pages, etc.)
│   │   ├── App.jsx         # Client routing definitions
│   │   ├── index.css       # Core styling & custom CSS design tokens
│   │   └── main.jsx        # App mounting entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend API
│   ├── controllers/        # Route controllers containing business logic
│   ├── middleware/         # Custom authentication & CORS middlewares
│   ├── models/             # Mongoose schemas (User, Product, Order, Cart, Admin)
│   ├── routes/             # API Router endpoints
│   ├── index.js            # Express server entry point
│   ├── seedProducts.js     # DB population script
│   └── package.json
└── README.md
```

### Data Flow Model
1. **User Interaction:** Client triggers actions (authentication, adding items, placing orders) which fire API requests via Axios.
2. **Routing:** Express parses incoming paths inside `server/index.js` and matches them to specific router files in `server/routes/`.
3. **Business Processing:** Controllers execute schema operations against the MongoDB instance utilizing Mongoose models.
4. **State Update:** Database operations resolve, and JSON responses return to the frontend to trigger React state adjustments or Toast alerts.

---

## ├── Future Improvements

Here is the upcoming development roadmap for ShopEZ:
*   **Integrated Payment Gateways:** Incorporate Stripe or Razorpay APIs to handle real-world transactions securely.
*   **Media Cloud Storage:** Connect Cloudinary or AWS S3 to upload product images dynamically from the Admin Dashboard, replacing manual text URIs.
*   **Interactive Analytics Charts:** Add Recharts/Chart.js visual diagrams to the Admin Dashboard for better revenue and order trends inspection.
*   **Real-time Order Updates:** Implement Socket.io WebSockets to alert users instantly as their order transitions from pending to delivered.
*   **Advanced Recommendations:** Leverage collaborative filtering to suggest products based on aggregate buyer similarity scores.
