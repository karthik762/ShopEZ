const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
const dotenv = require("dotenv");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopez";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for seeding...");

    
    const adminEmail = "admin@shopez.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "ShopEZ Admin",
        email: adminEmail,
        password: hashedPassword,
        usertype: "Admin",
        address: "ShopEZ Headquarters",
        phone: "1-800-SHOPEZ"
      });
      console.log("Admin user created (admin@shopez.com / admin123)");
    } else {
      console.log("Admin user already exists");
    }

    
    const admin2Email = "admin@admin";
    const existingAdmin2 = await User.findOne({ email: admin2Email });

    if (!existingAdmin2) {
      const hashedPassword2 = await bcrypt.hash("admin", 10);
      await User.create({
        username: "System Admin",
        email: admin2Email,
        password: hashedPassword2,
        usertype: "Admin",
        address: "System Headquarters",
        phone: "000"
      });
      console.log("Admin user created (admin@admin / admin)");
    } else {
      console.log("Admin admin@admin user already exists");
    }

    
    // Always clear and seed to update all products with new categories and prices
    await Product.deleteMany({});
    console.log("Cleared existing products from database...");

    const sampleProducts = [
      // Mobiles
      {
        name: "iPhone 15 Pro",
        description: "Titanium design, A17 Pro chip, customizable Action button, and a powerful 3-camera system.",
        price: 129999.00,
        category: "Mobiles",
        stock: 20,
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        description: "Integrated S Pen, advanced night photography, 100x zoom, and industry-leading performance.",
        price: 134999.00,
        category: "Mobiles",
        stock: 15,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Google Pixel 8 Pro",
        description: "The best of Google AI camera, 24-hour battery, and a stunning Super Actua display.",
        price: 99999.00,
        category: "Mobiles",
        stock: 25,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60"
      },
      // Electronics
      {
        name: "Wireless Noise-Canceling Headphones",
        description: "High-fidelity sound, active noise-canceling, and 40 hours of battery life.",
        price: 14999.00,
        category: "Electronics",
        stock: 50,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Smart Fitness Watch",
        description: "Heart rate monitor, GPS tracking, sleep analyzer, and swimproof design.",
        price: 9999.00,
        category: "Electronics",
        stock: 60,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "4K Ultra HD Smart Projector",
        description: "120-inch screen projection, 2500 ANSI lumens, built-in Android TV and Dolby Audio.",
        price: 49999.00,
        category: "Electronics",
        stock: 10,
        image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&auto=format&fit=crop&q=60"
      },
      // Fashion
      {
        name: "Classic Denim Jacket",
        description: "Timeless design, made with premium cotton denim, relaxed fit and multiple pockets.",
        price: 2499.00,
        category: "Fashion",
        stock: 80,
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Breathable Running Sneakers",
        description: "Lightweight mesh body, cushioned sole for maximum shock absorption and comfort.",
        price: 3999.00,
        category: "Fashion",
        stock: 45,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Polarized Wayfarer Sunglasses",
        description: "100% UV protection, classic style, lightweight and durable polycarbonate frame.",
        price: 1499.00,
        category: "Fashion",
        stock: 110,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60"
      },
      // Sports
      {
        name: "Non-Slip Yoga Mat",
        description: "Eco-friendly natural rubber, textured non-slip surface, extra cushioning for joints.",
        price: 1999.00,
        category: "Sports",
        stock: 70,
        image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Adjustable Dumbbells Set",
        description: "Space-saving dumbbells adjustable from 5 lbs to 52.5 lbs with a simple dial turn.",
        price: 15999.00,
        category: "Sports",
        stock: 15,
        image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Textured Soccer Match Ball",
        description: "Official size and weight, high durability textured casing for better control and flight.",
        price: 1299.00,
        category: "Sports",
        stock: 90,
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60"
      },
      // Books
      {
        name: "The Creative Act by Rick Rubin",
        description: "A beautiful and inspiring guide to creativity, art, and the creative mindset.",
        price: 699.00,
        category: "Books",
        stock: 120,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Atomic Habits by James Clear",
        description: "Learn how tiny changes can lead to remarkable results in your personal and professional life.",
        price: 499.00,
        category: "Books",
        stock: 200,
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Designing Data-Intensive Applications",
        description: "The definitive guide to the architecture, storage, and processing principles of data systems.",
        price: 1899.00,
        category: "Books",
        stock: 50,
        image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&auto=format&fit=crop&q=60"
      },
      // Accessories
      {
        name: "Minimalist Leather Backpack",
        description: "Water-resistant, fits 15-inch laptop, premium full-grain leather construction.",
        price: 6499.00,
        category: "Accessories",
        stock: 35,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Slim RFID Blocking Wallet",
        description: "Premium carbon fiber texture, holds up to 12 cards with an integrated money clip.",
        price: 999.00,
        category: "Accessories",
        stock: 150,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Ergonomic Aluminum Laptop Stand",
        description: "Height-adjustable, foldable design with anti-slip silicone pads for heat dissipation.",
        price: 1299.00,
        category: "Accessories",
        stock: 80,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60"
      },
      // Home & Kitchen
      {
        name: "Premium Ceramic Coffee Mug",
        description: "Double-walled insulation, elegant handmade design, comfortable grip.",
        price: 799.00,
        category: "Home & Kitchen",
        stock: 120,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Stainless Steel Water Bottle",
        description: "Keeps drinks cold for 24 hours or hot for 12 hours, leakproof lid.",
        price: 1199.00,
        category: "Home & Kitchen",
        stock: 150,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Precision Digital Kitchen Scale",
        description: "Measures up to 11 lbs with 0.1 oz graduation, clean tempered glass surface.",
        price: 899.00,
        category: "Home & Kitchen",
        stock: 130,
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60"
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log("Sample products seeded successfully");

    console.log("Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
