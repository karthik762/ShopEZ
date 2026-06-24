import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [singleProduct, setSingleProduct] = useState(null);
  const [size, setSize] = useState("M");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const { showToast } = useToast();
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  // Simulated credit card state details
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get("productId");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAddress(user.address || "");
    setPhone(user.phone || "");

    if (productId) {
      fetchProduct();
    } else {
      fetchCart();
    }
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${productId}`);
      setSingleProduct(res.data);
    } catch (err) {
      console.log("Error fetching product:", err);
      showToast("Failed to load product details.", "error");
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      setCart(res.data);
    } catch (err) {
      console.log("Error fetching cart:", err);
    }
  };

  const getSubtotal = () => {
    if (productId) {
      return singleProduct ? singleProduct.price : 0;
    }
    if (!cart?.products) return 0;
    return cart.products.reduce(
      (sum, item) => sum + (item.productId ? item.productId.price * item.quantity : 0),
      0
    );
  };

  const subtotal = getSubtotal();
  const shippingFee = subtotal > 2000 ? 0 : (subtotal > 0 ? 99 : 0);
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + shippingFee + gst;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (productId && !singleProduct) {
      showToast("Product not loaded.", "error");
      return;
    }
    if (!productId && !cart?.products?.length) {
      showToast("Your cart is empty.", "error");
      return;
    }

    // Shipping Validations
    if (!phone.trim()) {
      showToast("Phone number is required.", "error");
      return;
    }
    if (!address.trim()) {
      showToast("Delivery address is required.", "error");
      return;
    }

    // Simulated Card Details Validations
    if (!cardName.trim()) {
      showToast("Cardholder name is required.", "error");
      return;
    }
    const cleanNum = cardNumber.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(cleanNum)) {
      showToast("Card number must be exactly 16 digits.", "error");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      showToast("Expiry date must be in MM/YY format.", "error");
      return;
    }
    if (!/^\d{3}$/.test(cardCvv)) {
      showToast("CVV must be exactly 3 digits.", "error");
      return;
    }

    setPlacing(true);

    try {
      const token = localStorage.getItem("token");
      const products = productId
        ? [
            {
              productId: singleProduct._id,
              quantity: 1,
              size: size,
            },
          ]
        : cart.products
            .filter((item) => item.productId)
            .map((item) => ({
              productId: item.productId._id,
              quantity: item.quantity,
              size: "",
            }));

      await axios.post(
        "http://localhost:5000/api/orders/create",
        {
          userId: user._id,
          products,
          totalAmount: grandTotal,
          shippingAddress: address,
          phone,
          clearCart: !productId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.dispatchEvent(new Event("auth-change"));
      showToast("Order placed successfully!");
      navigate("/order-success");
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setPlacing(false);
    }
  };

  if (productId && !singleProduct) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Loading Product Details...</p>
      </div>
    );
  }
  if (!productId && !cart) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Loading Cart Details...</p>
      </div>
    );
  }

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
            Checkout
          </h1>
          <p style={{ margin: "4px 0 0", color: "hsl(var(--text-secondary))", fontSize: "0.95rem" }}>
            Provide shipping information and complete simulated card settlement.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} style={{ display: "flex", gap: "3rem", flexWrap: "wrap", alignItems: "start" }}>
          {/* Left Side Column: Forms (Shipping + Payment Details) */}
          <div style={{ flex: "2 1 500px", display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Shipping Details */}
            <div
              style={{
                border: "1.5px solid hsl(var(--text-primary))",
                backgroundColor: "hsl(var(--bg-card))",
                padding: "1.75rem",
              }}
            >
              <h3
                style={{
                  borderBottom: "1.5px solid hsl(var(--text-primary))",
                  paddingBottom: "8px",
                  marginBottom: "1.5rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                }}
              >
                Shipping Details
              </h3>
              
              {productId && (
                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label">Select Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="form-input"
                    style={{ height: "40px", cursor: "pointer" }}
                  >
                    <option value="S">S (Small)</option>
                    <option value="M">M (Medium)</option>
                    <option value="L">L (Large)</option>
                    <option value="XL">XL (Extra Large)</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="form-input"
                  style={{ height: "40px" }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Delivery Address *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Complete shipping and billing address"
                  rows={3}
                  className="form-input"
                  style={{ resize: "vertical", lineHeight: "1.5" }}
                />
              </div>
            </div>

            {/* Simulated Payment */}
            <div
              style={{
                border: "1.5px solid hsl(var(--text-primary))",
                backgroundColor: "hsl(var(--bg-card))",
                padding: "1.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1.5px solid hsl(var(--text-primary))",
                  paddingBottom: "8px",
                  marginBottom: "1.5rem",
                }}
              >
                <h3 style={{ margin: 0, fontWeight: 800, fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
                  Simulated Card Payment
                </h3>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "hsl(var(--success))",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    border: "1px solid currentColor",
                    padding: "2px 8px",
                  }}
                >
                  [ Sandbox Simulation ]
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Cardholder Name *</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Enter cardholder name"
                  className="form-input"
                  style={{ height: "40px" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Card Number *</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                    setCardNumber(val.replace(/(.{4})/g, "$1 ").trim());
                  }}
                  placeholder="0000 0000 0000 0000"
                  className="form-input"
                  style={{ height: "40px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                  <label className="form-label">Expiry Date *</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 2) {
                        val = val.slice(0, 2) + "/" + val.slice(2, 4);
                      }
                      setCardExpiry(val.slice(0, 5));
                    }}
                    placeholder="MM/YY"
                    className="form-input"
                    style={{ height: "40px" }}
                  />
                </div>

                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                  <label className="form-label">CVV *</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="000"
                    className="form-input"
                    style={{ height: "40px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Column: Order subtotal summary breakdown */}
          <div style={{ flex: "1 1 320px", position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                Order Summary
              </h3>
              
              {/* Products summary list */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid hsl(var(--border))",
                  paddingBottom: "12px",
                }}
              >
                {productId ? (
                  singleProduct && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontWeight: 700 }}>{singleProduct.name}</span>
                        <span style={{ fontSize: "0.75rem", color: "hsl(var(--text-secondary))" }}>Size: {size}</span>
                      </div>
                      <span style={{ fontWeight: 700 }}>₹{Number(singleProduct.price).toLocaleString("en-IN")}.00</span>
                    </div>
                  )
                ) : (
                  cart.products?.filter(item => item.productId).map((item) => (
                    <div key={item._id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontWeight: 700 }}>{item.productId.name}</span>
                        <span style={{ fontSize: "0.75rem", color: "hsl(var(--text-secondary))" }}>Qty: {item.quantity}</span>
                      </div>
                      <span style={{ fontWeight: 700 }}>₹{(item.productId.price * item.quantity).toLocaleString("en-IN")}.00</span>
                    </div>
                  ))
                )}
              </div>

              {/* Calculations layout details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
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
                  <span>{shippingFee === 0 ? <span style={{ color: "hsl(var(--success))" }}>FREE</span> : `₹${shippingFee.toLocaleString("en-IN")}.00`}</span>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1.5px solid hsl(var(--text-primary))", marginBottom: "1.25rem" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "hsl(var(--text-secondary))" }}>Total Bill</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "hsl(var(--text-primary))" }}>₹{grandTotal.toLocaleString("en-IN")}.00</span>
              </div>

              <div
                style={{
                  backgroundColor: "hsl(var(--bg-secondary))",
                  padding: "10px 12px",
                  fontSize: "0.75rem",
                  color: "hsl(var(--text-secondary))",
                  border: "1px solid hsl(var(--border))",
                  marginBottom: "1.5rem",
                  lineHeight: "1.4",
                  fontWeight: 500,
                }}
              >
                Sandbox Mode: Enter any mock card numbers to authorize transaction.
              </div>

              <button
                type="submit"
                disabled={placing}
                className="btn btn-primary btn-lg"
                style={{ width: "100%" }}
              >
                {placing ? "Processing..." : `Confirm Payment: ₹${grandTotal.toLocaleString("en-IN")}.00`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
