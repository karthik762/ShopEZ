import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const { showToast } = useToast();
  const [categories, setCategories] = useState(["All"]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/settings");
      if (res.data && res.data.categories) {
        setCategories(["All", ...res.data.categories]);
      }
    } catch (error) {
      setCategories(["All", "Electronics", "Fashion", "Sports", "Books"]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterProducts = (searchText, category) => {
    let filtered = [...products];

    if (category !== "All") {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (searchText) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterProducts(value, selectedCategory);
  };

  const handleCategory = (category) => {
    setSelectedCategory(category);
    filterProducts(search, category);
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sorted = [...filteredProducts];

    if (option === "low") {
      sorted.sort((a, b) => a.price - b.price);
    }

    if (option === "high") {
      sorted.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sorted);
  };

  const addToCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      showToast("Please login first", "info");
      navigate("/login");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        productId,
        quantity: 1,
      });

      showToast("Added to cart!");
      window.dispatchEvent(new Event("auth-change"));
    } catch (error) {
      console.log(error);
      showToast("Failed to add product to cart", "error");
    }
  };

  return (
    <div className="container" style={{ paddingBottom: "6rem" }}>
      {/* Header Block */}
      <div
        style={{
          borderBottom: "1.5px solid hsl(var(--text-primary))",
          paddingBottom: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2.75rem",
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
          }}
        >
          Curated Essentials
        </h1>
        <p style={{ margin: "6px 0 0", color: "hsl(var(--text-secondary))", fontSize: "1rem" }}>
          Premium goods, zero fillers. Handpicked for quality and endurance.
        </p>
      </div>

      {/* Filter and Search Bar Panel */}
      <div
        style={{
          marginBottom: "3rem",
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "1rem",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        {/* Categories Text Filters */}
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.25rem 0",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: isActive ? "hsl(var(--accent))" : "hsl(var(--text-secondary))",
                  borderBottom: isActive ? "2px solid hsl(var(--accent))" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.color = "hsl(var(--text-primary))";
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.color = "hsl(var(--text-secondary))";
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Input Controls */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
            flex: "1",
            justifyContent: "flex-end",
            minWidth: "280px",
          }}
        >
          <input
            type="text"
            placeholder="SEARCH PRODUCTS..."
            value={search}
            onChange={handleSearch}
            className="form-input"
            style={{
              width: "240px",
              height: "38px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          />

          <select
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
            className="form-input"
            style={{
              width: "180px",
              height: "38px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              paddingRight: "1.5rem",
            }}
          >
            <option value="default">SORT: DEFAULT</option>
            <option value="low">PRICE: LOW TO HIGH</option>
            <option value="high">PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div
          style={{
            padding: "6rem 2rem",
            textAlign: "center",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <p style={{ fontSize: "1rem", color: "hsl(var(--text-secondary))", marginBottom: "1.5rem" }}>
            No products found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearch("");
              filterProducts("", "All");
            }}
            className="btn btn-secondary btn-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3" style={{ gap: "2.5rem 2rem" }}>
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock === 0;
            const isLowStock = product.stock > 0 && product.stock <= 5;

            return (
              <div
                key={product._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  border: "1.5px solid hsl(var(--text-primary))",
                  padding: "1rem",
                  position: "relative",
                  backgroundColor: "hsl(var(--bg-card))",
                }}
              >
                {/* Product Image Panel */}
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "1px solid hsl(var(--border))",
                    marginBottom: "1rem",
                  }}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "240px",
                        objectFit: "cover",
                        display: "block",
                        filter: isOutOfStock ? "grayscale(100%)" : "none",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "240px",
                        backgroundColor: "hsl(var(--bg-secondary))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "hsl(var(--text-muted))",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      No Image Available
                    </div>
                  )}

                  {/* Stark Text Stock urgency in bottom left */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      left: "8px",
                      backgroundColor: "hsl(var(--text-primary))",
                      color: "hsl(var(--bg-primary))",
                      padding: "2px 8px",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {product.category}
                  </span>
                </div>

                {/* Card Info Details */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3
                      onClick={() => navigate(`/product/${product._id}`)}
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-display)",
                        marginBottom: "6px",
                        cursor: "pointer",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.name}
                    </h3>
                    
                    {/* Stark Boxed Stock Urgency Box */}
                    <div style={{ marginBottom: "12px", minHeight: "22px" }}>
                      {isOutOfStock ? (
                        <span
                          style={{
                            display: "inline-block",
                            border: "1px solid hsl(var(--danger))",
                            color: "hsl(var(--danger))",
                            padding: "2px 8px",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                          }}
                        >
                          [ OUT OF STOCK ]
                        </span>
                      ) : isLowStock ? (
                        <span
                          style={{
                            display: "inline-block",
                            border: "1px solid hsl(var(--accent))",
                            color: "hsl(var(--accent))",
                            padding: "2px 8px",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                          }}
                        >
                          [ ONLY {product.stock} LEFT ]
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            border: "1px solid hsl(var(--border))",
                            color: "hsl(var(--text-secondary))",
                            padding: "2px 8px",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                          }}
                        >
                          [ IN STOCK ]
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "hsl(var(--text-secondary))",
                        marginBottom: "1.25rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "1.5",
                        minHeight: "2.5rem",
                      }}
                    >
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: "1.25rem",
                        borderTop: "1px solid hsl(var(--border))",
                        paddingTop: "0.75rem",
                      }}
                    >
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</span>
                      <span style={{ fontSize: "1.35rem", fontWeight: 700, color: "hsl(var(--text-primary))", fontFamily: "var(--font-body)" }}>
                        ₹{Number(product.price).toLocaleString("en-IN")}.00
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="btn btn-secondary"
                        style={{ flex: 1, height: "40px" }}
                      >
                        Details
                      </button>
                      <button
                        disabled={isOutOfStock}
                        onClick={() => addToCart(product._id)}
                        className="btn btn-primary"
                        style={{ flex: 1, height: "40px" }}
                      >
                        {isOutOfStock ? "Sold Out" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Products;