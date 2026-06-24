import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "../components/Toast";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [size, setSize] = useState("M");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError(err.response?.data?.message || "Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      showToast("Please login first", "info");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        productId: product._id,
        quantity: 1,
      });

      showToast("Added to cart successfully!");
      window.dispatchEvent(new Event("auth-change"));
    } catch (err) {
      console.error("Error adding to cart:", err);
      showToast("Failed to add product to cart", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShopNow = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      showToast("Please login first", "info");
      navigate("/login");
      return;
    }

    navigate(`/checkout?productId=${product._id}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="container" style={{ textAlign: "center", padding: "5rem 0" }}>
          <p style={{ fontSize: "1rem", color: "hsl(var(--text-secondary))", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
        <div className="container" style={{ maxWidth: "600px", padding: "6rem 1.5rem", textAlign: "center" }}>
          <div style={{ border: "1.5px solid hsl(var(--text-primary))", padding: "3rem 1.5rem", backgroundColor: "hsl(var(--bg-card))" }}>
            <h2 style={{ color: "hsl(var(--danger))", marginBottom: "1rem" }}>Error</h2>
            <p style={{ marginBottom: "2rem", color: "hsl(var(--text-secondary))" }}>{error || "Product not found."}</p>
            <Link to="/products" className="btn btn-secondary">
              Return to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
      <div className="container" style={{ maxWidth: "960px", paddingBottom: "6rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <Link to="/products" className="nav-link" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
            &larr; BACK TO PRODUCTS
          </Link>
        </div>

        <div className="grid grid-cols-2" style={{ gap: "4rem", alignItems: "start" }}>
          {/* Product Image Panel */}
          <div
            style={{
              padding: "0",
              overflow: "hidden",
              border: "1.5px solid hsl(var(--text-primary))",
              backgroundColor: "hsl(var(--bg-card))",
            }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "cover",
                  display: "block",
                  filter: isOutOfStock ? "grayscale(100%)" : "none",
                }}
              />
            ) : (
              <div
                style={{
                  height: "360px",
                  backgroundColor: "hsl(var(--bg-secondary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "hsl(var(--text-muted))",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.8rem",
                }}
              >
                No Image Available
              </div>
            )}
          </div>

          {/* Product Details Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "1rem" }}>
                <span
                  style={{
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--text-secondary))",
                    padding: "2px 8px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {product.category}
                </span>

                {isOutOfStock ? (
                  <span
                    style={{
                      border: "1px solid hsl(var(--danger))",
                      color: "hsl(var(--danger))",
                      padding: "2px 8px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    [ OUT OF STOCK ]
                  </span>
                ) : isLowStock ? (
                  <span
                    style={{
                      border: "1px solid hsl(var(--accent))",
                      color: "hsl(var(--accent))",
                      padding: "2px 8px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    [ ONLY {product.stock} LEFT ]
                  </span>
                ) : (
                  <span
                    style={{
                      border: "1px solid hsl(var(--success))",
                      color: "hsl(var(--success))",
                      padding: "2px 8px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    [ IN STOCK - {product.stock} AVAILABLE ]
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontSize: "2.8rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.03em",
                }}
              >
                {product.name}
              </h1>

              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 700,
                  color: "hsl(var(--text-primary))",
                  marginTop: "0.5rem",
                }}
              >
                ₹{Number(product.price).toLocaleString("en-IN")}.00
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1.5px solid hsl(var(--text-primary))" }} />

            <div>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem", color: "hsl(var(--text-secondary))" }}>
                Description
              </h3>
              <p
                style={{
                  color: "hsl(var(--text-secondary))",
                  fontSize: "0.95rem",
                  lineHeight: "1.7",
                  whiteSpace: "pre-line",
                }}
              >
                {product.description}
              </p>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid hsl(var(--border))" }} />

            {/* Sizes Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Select Size
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["S", "M", "L", "XL"].map((sz) => {
                    const isSelected = size === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSize(sz)}
                        className={isSelected ? "btn btn-primary" : "btn btn-secondary"}
                        style={{
                          width: "44px",
                          height: "44px",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          padding: "0",
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "1rem" }}>
                <button
                  disabled={isOutOfStock || addingToCart}
                  onClick={addToCart}
                  className="btn btn-secondary btn-lg"
                  style={{ flex: 1, height: "48px" }}
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  disabled={isOutOfStock}
                  onClick={handleShopNow}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1, height: "48px" }}
                >
                  {isOutOfStock ? "Out of Stock" : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
