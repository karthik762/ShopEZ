process.env.PORT = 0; // Bind to a random free port to prevent conflicts
const request = require("supertest");
const mongoose = require("mongoose");

// Mock Mongoose connection to avoid live DB calls
jest.mock("mongoose", () => {
  const originalMongoose = jest.requireActual("mongoose");
  return {
    ...originalMongoose,
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      ...originalMongoose.connection,
      readyState: 1, // Simulates connected state to bypass connectDB middleware
      close: jest.fn().mockResolvedValue(true)
    }
  };
});

// Mock Mongoose models
jest.mock("../models/Product", () => {
  return {
    find: jest.fn()
  };
});

jest.mock("../models/Order", () => {
  return {
    find: jest.fn()
  };
});

const app = require("../index");
const Product = require("../models/Product");
const Order = require("../models/Order");

describe("GET /api/products/recommendations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should return fallback recommendations (new arrivals) for guest user", async () => {
    const mockProducts = [
      { _id: "prod1", name: "Product 1", price: 100, category: "Electronics", stock: 10, createdAt: new Date("2026-01-01") },
      { _id: "prod2", name: "Product 2", price: 200, category: "Fashion", stock: 5, createdAt: new Date("2026-01-02") },
      { _id: "prod3", name: "Product 3", price: 300, category: "Books", stock: 8, createdAt: new Date("2026-01-03") }
    ];

    Product.find.mockResolvedValue(mockProducts);

    const response = await request(app)
      .get("/api/products/recommendations")
      .expect(200);

    expect(response.body).toHaveLength(3);
    expect(response.body[0].product._id).toBe("prod3");
    expect(response.body[1].product._id).toBe("prod2");
    expect(response.body[2].product._id).toBe("prod1");
    expect(response.body[0].reason).toBe("New Arrival");
  });

  test("should return personalized recommendations for a user with purchase history", async () => {
    const mockProducts = [
      { _id: "prod1", name: "Product 1", price: 100, category: "Electronics", stock: 10 },
      { _id: "prod2", name: "Product 2", price: 200, category: "Fashion", stock: 5 },
      { _id: "prod3", name: "Product 3", price: 300, category: "Electronics", stock: 8 },
      { _id: "prod4", name: "Product 4", price: 400, category: "Books", stock: 2 }
    ];

    const mockOrders = [
      {
        _id: "order1",
        totalAmount: 200,
        products: [
          {
            productId: { _id: "prod1", category: "Electronics" },
            quantity: 2
          }
        ]
      }
    ];

    Product.find.mockResolvedValue(mockProducts);
    Order.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockOrders)
    });

    const response = await request(app)
      .get("/api/products/recommendations/user123")
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].product._id).toBe("prod1");
    expect(response.body[0].reason).toBe("Your Most Ordered Item");
  });
});
