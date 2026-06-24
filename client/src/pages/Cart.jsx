import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const user = getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      if (!res.data) {
        setCart({ products: [] });
      } else {
        setCart(res.data);
      }
    } catch (error) {
      console.log(error);
      setCart({ products: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    const user = getUser();
    if (!user) return;

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        productId,
        quantity: 1,
      });

      fetchCart();
      window.dispatchEvent(new Event("auth-change"));
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (productId) => {
    const user = getUser();
    if (!user) return;

    try {
      await axios.delete("http://localhost:5000/api/cart/remove", {
        data: {
          userId: user._id,
          productId,
        },
      });

      fetchCart();
      window.dispatchEvent(new Event("auth-change"));
    } catch (error) {
      console.log(error);
    }
  };

  const getTotal = () => {
    if (!cart?.products) return 0;
    return cart.products.reduce((sum, item) => {
      if (!item.productId) return sum;
      return sum + item.productId.price * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(var(--text-secondary))" }}>
            Loading cart...
          </p>
        </div>
      </div>
    );
  }

  const user = getUser();

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
        <div className="container" style={{ maxWidth: "600px", padding: "6rem 1.5rem", textAlign: "center" }}>
          <div style={{ border: "1.5px solid hsl(var(--text-primary))", padding: "3rem 1.5rem", backgroundColor: "hsl(var(--bg-card))" }}>
            <p style={{ fontSize: "1rem", color: "hsl(var(--text-secondary))", marginBottom: "1.5rem" }}>
              Please login to view your cart contents.
            </p>
            <Link to="/login" className="btn btn-primary">
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.usertype === "Admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
        <div className="container" style={{ maxWidth: "600px", padding: "6rem 1.5rem", textAlign: "center" }}>
          <div style={{ border: "1.5px solid hsl(var(--text-primary))", padding: "3rem 1.5rem", backgroundColor: "hsl(var(--bg-card))" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
              Admin Workspaces
            </h2>
            <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-secondary))", marginBottom: "1.5rem" }}>
              Admin accounts do not manage customer cart states.
            </p>
            <Link to="/admin" className="btn btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shippingFee = subtotal > 2000 ? 0 : (subtotal > 0 ? 99 : 0);
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + shippingFee + gst;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
      <div className="container" style={{ paddingBottom: "6rem" }}>
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
              fontSize: "2.5rem",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
            }}
          >
            Your Cart
          </h1>
          <p style={{ margin: "4px 0 0", color: "hsl(var(--text-secondary))", fontSize: "0.95rem" }}>
            Review selected items and proceed to checkout processing.
          </p>
        </div>

        {!cart?.products || cart.products.filter((item) => item.productId).length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              border: "1.5px solid hsl(var(--text-primary))",
              backgroundColor: "hsl(var(--bg-card))",
            }}
          >
            <p style={{ margin: "0 0 1.5rem", fontSize: "1rem", color: "hsl(var(--text-secondary))" }}>
              Your cart is currently empty.
            </p>
            <Link to="/products" className="btn btn-primary">
              Browse Storefront
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", alignItems: "start" }}>
            {/* Left Side: Cart Items list */}
            <div style={{ flex: "2 1 500px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {cart.products
                .filter((item) => item.productId)
                .map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.25rem",
                      border: "1.5px solid hsl(var(--text-primary))",
                      backgroundColor: "hsl(var(--bg-card))",
                      gap: "1.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                      {item.productId.image ? (
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            border: "1px solid hsl(var(--border))",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={item.productId.image}
                            alt={item.productId.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "hsl(var(--bg-secondary))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            color: "hsl(var(--text-muted))",
                            border: "1px solid hsl(var(--border))",
                            flexShrink: 0,
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          No Image
                        </div>
                      )}

                      <div>
                        <h3 style={{ margin: "0 0 6px", fontSize: "1.2rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
                          {item.productId.name}
                        </h3>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            border: "1px solid hsl(var(--border))",
                            padding: "2px 8px",
                            color: "hsl(var(--text-secondary))",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {item.productId.category}
                        </span>
                        <p style={{ margin: "8px 0 0", fontSize: "0.85rem", color: "hsl(var(--text-secondary))", fontWeight: 500 }}>
                          ₹{Number(item.productId.price).toLocaleString("en-IN")}.00 each
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {/* Quantity Selector buttons */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1.5px solid hsl(var(--text-primary))",
                          height: "38px",
                          backgroundColor: "hsl(var(--bg-primary))",
                        }}
                      >
                        <button
                          onClick={() => removeFromCart(item.productId._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ border: "none", padding: "0 12px", height: "100%", minWidth: "38px" }}
                        >
                          &minus;
                        </button>
                        <span style={{ padding: "0 12px", fontWeight: 700, fontSize: "0.85rem", minWidth: "32px", textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          disabled={item.productId.stock <= item.quantity}
                          onClick={() => addToCart(item.productId._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ border: "none", padding: "0 12px", height: "100%", minWidth: "38px" }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ textAlign: "right", minWidth: "100px" }}>
                        <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "hsl(var(--text-primary))" }}>
                          ₹{(item.productId.price * item.quantity).toLocaleString("en-IN")}.00
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Right Side: Order Subtotal Breakdown card */}
            <div style={{ flex: "1 1 320px", position: "sticky", top: "100px" }}>
              <div
                style={{
                  border: "1.5px solid hsl(var(--text-primary))",
                  backgroundColor: "hsl(var(--bg-card))",
                  padding: "1.5rem",
                }}
              >
                <h3
                  style={{
                    borderBottom: "1.5px solid hsl(var(--text-primary))",
                    paddingBottom: "10px",
                    marginBottom: "1.5rem",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-display)",
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Summary
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600 }}>
                    <span style={{ color: "hsl(var(--text-secondary))", textTransform: "uppercase" }}>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600 }}>
                    <span style={{ color: "hsl(var(--text-secondary))", textTransform: "uppercase" }}>Taxes (GST 5%)</span>
                    <span>₹{gst.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600 }}>
                    <span style={{ color: "hsl(var(--text-secondary))", textTransform: "uppercase" }}>Shipping Fee</span>
                    <span>
                      {shippingFee === 0 ? <span style={{ color: "hsl(var(--success))" }}>FREE</span> : `₹${shippingFee.toLocaleString("en-IN")}.00`}
                    </span>
                  </div>
                  
                  {shippingFee > 0 && (
                    <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "hsl(var(--accent))", fontStyle: "italic", fontWeight: 600 }}>
                      Add ₹{(2000 - subtotal).toLocaleString("en-IN")}.00 more for free delivery!
                    </p>
                  )}
                </div>

                <hr style={{ border: "none", borderTop: "1px solid hsl(var(--border))", marginBottom: "1.25rem" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.75rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "hsl(var(--text-secondary))" }}>Total Bill</span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "hsl(var(--text-primary))" }}>₹{grandTotal.toLocaleString("en-IN")}.00</span>
                </div>

                <Link to="/checkout" style={{ display: "block" }}>
                  <button className="btn btn-primary btn-lg" style={{ width: "100%" }}>
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;