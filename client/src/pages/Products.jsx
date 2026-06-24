import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] =
    useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [sortOption, setSortOption] =
    useState("default");
  const [displayRecommendations, setDisplayRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    const storedUser = localStorage.getItem("user");
    let userId = null;
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.usertype !== "Admin") {
          userId = user._id;
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchRecommendations(userId);
  }, []);

  const fetchRecommendations = async (userId) => {
    try {
      const url = userId
        ? `${API_URL}/api/products/recommendations/${userId}`
        : `${API_URL}/api/products/recommendations`;
      const res = await axios.get(url);
      setDisplayRecommendations(res.data);
    } catch (err) {
      console.log("Error fetching recommendations:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/products`
      );

      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterProducts = (
    searchText,
    category
  ) => {
    let filtered = [...products];

    if (category !== "All") {
      filtered = filtered.filter((product) => {
        if (!product.category) return false;
        if (Array.isArray(product.category)) {
          return product.category.includes(category);
        }
        return product.category === category;
      });
    }

    if (searchText) {
      filtered = filtered.filter((product) =>
        product.name
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    filterProducts(
      value,
      selectedCategory
    );
  };

  const handleCategory = (
    category
  ) => {
    setSelectedCategory(category);

    filterProducts(
      search,
      category
    );
  };

  const handleSort = (option) => {
    setSortOption(option);

    let sorted = [...filteredProducts];

    if (option === "low") {
      sorted.sort(
        (a, b) => a.price - b.price
      );
    }

    if (option === "high") {
      sorted.sort(
        (a, b) => b.price - a.price
      );
    }

    setFilteredProducts(sorted);
  };

  const addToCart = async (
    productId
  ) => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      window.showToast("Please Login First", "info");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/cart/add`,
        {
          userId: user._id,
          productId,
          quantity: 1,
        }
      );

      window.showToast("Added To Cart!", "success");

      window.dispatchEvent(
        new Event("auth-change")
      );
    } catch (error) {
      console.log(error);
      window.showToast("Failed To Add Product", "error");
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "var(--heading)", fontSize: "42px", color: "var(--text-h)", marginBottom: "30px" }}>
        Products Collection
      </h1>

      {}
      <div style={{ display: "flex", gap: "16px", marginBottom: "30px", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search Products..."
          value={search}
          onChange={handleSearch}
          style={{
            padding: "10px 14px",
            width: "320px",
            marginBottom: 0,
          }}
        />

        <select
          value={sortOption}
          onChange={(e) => handleSort(e.target.value)}
          style={{
            padding: "10px 14px",
            marginBottom: 0,
          }}
        >
          <option value="default">Default Sort</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {}
      <div
        style={{
          marginTop: "10px",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {[
          "All",
          "Mobiles",
          "Electronics",
          "Fashion",
          "Sports",
          "Books",
          "Accessories",
          "Home & Kitchen",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            style={{
              padding: "8px 18px",
              cursor: "pointer",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              backgroundColor: selectedCategory === cat ? "var(--accent)" : "transparent",
              color: selectedCategory === cat ? "var(--matte-black)" : "var(--text)",
              border: selectedCategory === cat ? "1px solid var(--accent)" : "1px solid var(--border)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {}
      {displayRecommendations.length > 0 && (
        <div style={{
          maxWidth: "800px",
          margin: "0 auto 40px auto",
          textAlign: "left",
          background: "linear-gradient(135deg, rgba(200, 184, 122, 0.08) 0%, rgba(22, 22, 22, 0.6) 100%)",
          border: "1px solid var(--accent-border)",
          borderRadius: "12px",
          padding: "24px 30px",
          boxShadow: "var(--shadow)"
        }}>
          <h2 style={{
            fontFamily: "var(--heading)",
            fontSize: "24px",
            color: "var(--accent)",
            margin: "0 0 8px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            ✨ Recommended for You
          </h2>
          <p style={{
            color: "var(--text)",
            fontSize: "14px",
            marginBottom: "20px",
            opacity: 0.8
          }}>
            Based on your interests, we think you'll love these curated items:
          </p>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px"
          }}>
            {displayRecommendations.map((rec) => {
              const product = rec.product;
              return (
                <div
                  key={product._id}
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "border-color 0.3s ease"
                  }}
                >
                  <div>
                    {rec.reason && (
                      <span style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "9px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "10px",
                        background: "var(--accent-bg)",
                        color: "var(--accent)",
                        border: "1px solid var(--accent-border)"
                      }}>
                        {rec.reason}
                      </span>
                    )}
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "140px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid var(--border)",
                          marginBottom: "12px"
                        }}
                      />
                    )}
                    <h3 style={{
                      fontFamily: "var(--heading)",
                      fontSize: "18px",
                      color: "var(--text-h)",
                      margin: "0 0 6px 0"
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      color: "var(--text)",
                      fontSize: "12px",
                      margin: "0 0 12px 0",
                      opacity: 0.8,
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {product.description}
                    </p>
                  </div>
                  <div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "8px"
                    }}>
                      <span style={{
                        color: "var(--accent)",
                        fontFamily: "var(--heading)",
                        fontSize: "18px",
                        fontWeight: "600"
                      }}>
                        ₹{product.price}
                      </span>
                      <button
                        onClick={() => addToCart(product._id)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "11px",
                          cursor: "pointer"
                        }}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--card-bg)",
              padding: "24px",
              marginBottom: "24px",
              borderRadius: "8px",
              boxShadow: "var(--shadow)",
              display: "flex",
              gap: "24px",
              alignItems: "center",
              textAlign: "left",
            }}
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "160px",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                }}
              />
            )}

            <div style={{ flex: 1 }}>
              <h2 style={{ margin: "0 0 8px", fontFamily: "var(--heading)", fontSize: "24px", color: "var(--text-h)" }}>
                {product.name}
              </h2>
              <p style={{ margin: "0 0 12px", color: "var(--text)", fontSize: "14px", opacity: 0.8 }}>
                {product.description}
              </p>
              <div style={{ display: "flex", gap: "20px", marginBottom: "16px", fontSize: "13px", color: "var(--stone-taupe)" }}>
                <span>
                  <strong>Category:</strong> {Array.isArray(product.category) ? product.category.join(", ") : product.category}
                </span>
                <span>
                  <strong>Stock:</strong> {product.stock > 0 ? product.stock : "Out of stock"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <h3 style={{ margin: 0, color: "var(--accent)", fontSize: "22px", fontFamily: "var(--heading)" }}>
                  ₹{product.price}
                </h3>
                <button
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product._id)}
                  style={{
                    padding: "10px 20px",
                    cursor: product.stock === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;