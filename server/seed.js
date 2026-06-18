const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
const dotenv = require("dotenv");

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

    
    const existingProductsCount = await Product.countDocuments();
    if (existingProductsCount === 0) {
      const sampleProducts = [
        {
          name: "Wireless Noise-Canceling Headphones",
          description: "High-fidelity sound, active noise-canceling, 40 hours of battery life.",
          price: 199.99,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
          category: "Electronics",
          stock: 50
        },
        {
          name: "Minimalist Leather Backpack",
          description: "Water-resistant, fits 15-inch laptop, premium full-grain leather.",
          price: 89.50,
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
          category: "Accessories",
          stock: 35
        },
        {
          name: "Smart Fitness Watch",
          description: "Heart rate monitor, GPS tracking, sleep analyzer, swimproof.",
          price: 129.99,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
          category: "Electronics",
          stock: 60
        },
        {
          name: "Premium Ceramic Coffee Mug",
          description: "Double-walled insulation, elegant design, comfortable grip.",
          price: 24.99,
          image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60",
          category: "Home & Kitchen",
          stock: 120
        },
        {
          name: "Stainless Steel Water Bottle",
          description: "Keeps drinks cold for 24 hours or hot for 12 hours, leakproof lid.",
          price: 18.99,
          image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
          category: "Home & Kitchen",
          stock: 150
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log("Sample products seeded successfully");
    } else {
      console.log("Products already exist in database, skipping product seed");
    }

    console.log("Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
