const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Product = require("./models/Product");
const Admin = require("./models/Admin");
const User = require("./models/User");
const Cart = require("./models/Cart");
const Order = require("./models/Order");

dotenv.config();

const products = [
  // Mobiles
  {
    name: "iPhone 15 Pro",
    description: "Experience the ultimate iPhone with titanium casing, A17 Pro chip, and advanced custom action button.",
    price: 134900,
    category: "Electronics",
    stock: 15,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop"
  },
  {
    name: "Galaxy S24 Ultra",
    description: "Unleash new levels of creativity and productivity with built-in S Pen and AI camera technology.",
    price: 129999,
    category: "Electronics",
    stock: 12,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop"
  },
  {
    name: "OnePlus 12",
    description: "Equipped with Snapdragon 8 Gen 3, ultra-fast 100W charging, and 4th Gen Hasselblad camera system.",
    price: 64999,
    category: "Electronics",
    stock: 20,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop"
  },

  // Electronics
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation, exceptional sound quality, and premium design for all-day comfort.",
    price: 29990,
    category: "Electronics",
    stock: 25,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop"
  },
  {
    name: "Apple iPad Air (M2)",
    description: "Stunning 11-inch Liquid Retina display, fast M2 chip, and support for Apple Pencil Pro.",
    price: 59900,
    category: "Electronics",
    stock: 18,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop"
  },
  {
    name: "Dell XPS 13 Laptop",
    description: "Premium ultra-thin laptop with stunning InfinityEdge display, Intel Core Ultra 7 processor, and 16GB RAM.",
    price: 115000,
    category: "Electronics",
    stock: 8,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop"
  },
  {
    name: "Custom Mechanical Keyboard",
    description: "75% layout custom mechanical keyboard with hot-swappable key switches and RGB backlighting.",
    price: 8500,
    category: "Electronics",
    stock: 14,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop"
  },

  // Fashion
  {
    name: "Minimalist Leather Watch",
    description: "Timeless classic wristwatch with genuine brown leather strap and clean cream dial display.",
    price: 6500,
    category: "Fashion",
    stock: 30,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop"
  },
  {
    name: "Classic Denim Jacket",
    description: "Authentic heavy-wash denim jacket. Sturdy, warm, and perfect for layering over any casual outfit.",
    price: 3499,
    category: "Fashion",
    stock: 22,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&auto=format&fit=crop"
  },
  {
    name: "Premium Leather Boots",
    description: "Waterproof leather boots built for durability and style. Features cushioned ortholite insoles.",
    price: 7999,
    category: "Fashion",
    stock: 10,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop"
  },
  {
    name: "Canvas Adventure Backpack",
    description: "Sturdy water-resistant canvas backpack with secure magnetic closures and laptop sleeve.",
    price: 2499,
    category: "Fashion",
    stock: 45,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop"
  },

  // Sports
  {
    name: "Hydro Flask Insulated Bottle",
    description: "Keep your drinks ice cold for 24 hours or piping hot for 12. Durable powder-coated finish.",
    price: 1899,
    category: "Sports",
    stock: 50,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop"
  },
  {
    name: "Eco-Friendly Yoga Mat",
    description: "Non-slip texture, 6mm thickness, made of biodegradable TPE materials for joint support.",
    price: 1499,
    category: "Sports",
    stock: 35,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop"
  },
  {
    name: "Ergonomic Hex Dumbbells (Set of 2)",
    description: "Durable neoprene-coated cast iron dumbbells for gym strength training at home. 5kg each.",
    price: 2200,
    category: "Sports",
    stock: 15,
    image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600&auto=format&fit=crop"
  },

  // Books
  {
    name: "Minimalist Hardcover Notebook",
    description: "Premium lay-flat notebook with 160 pages of lined ivory paper, perfect for journaling.",
    price: 799,
    category: "Books",
    stock: 100,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop"
  },
  {
    name: "Classic Adventure Novel Collection",
    description: "An elegant hardcover box set featuring three classic tales of discovery and epic journeys.",
    price: 2499,
    category: "Books",
    stock: 20,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear old products
    await Product.deleteMany({});
    console.log("Cleared old products.");

    // Seed new products
    await Product.insertMany(products);
    console.log("Successfully seeded new products!");

    // Clear old user data, carts, and orders
    await User.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared all users, carts, and orders.");

    // Seed new Admin user (t@e / 1)
    const hashedPassword = await bcrypt.hash("1", 10);
    await User.create({
      username: "admin",
      email: "t@e",
      password: hashedPassword,
      usertype: "Admin"
    });
    console.log("Created new Admin user (t@e / 1).");

    // Ensure Admin settings document exists
    const adminSettings = await Admin.findOne();
    if (!adminSettings) {
      await Admin.create({
        banner: "🚀 Grand Opening Sale! Save up to 20% on premium electronics and fashion today! 🚀",
        categories: ["Electronics", "Fashion", "Sports", "Books"]
      });
      console.log("Created default Admin settings document.");
    } else {
      adminSettings.banner = "🚀 Grand Opening Sale! Save up to 20% on premium electronics and fashion today! 🚀";
      adminSettings.categories = ["Electronics", "Fashion", "Sports", "Books"];
      await adminSettings.save();
      console.log("Updated existing Admin settings document.");
    }

    mongoose.connection.close();
    console.log("Seeding complete. Connection closed.");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
