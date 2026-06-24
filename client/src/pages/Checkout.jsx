import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    setAddress(user.address || "");
    setPhone(user.phone || "");
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart/${user._id}`);
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTotal = () => {
    if (!cart?.products) return 0;
    return cart.products.reduce(
      (sum, item) => sum + item.productId.price * item.quantity, 0
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart?.products?.length) return window.showToast("Your cart is empty.", "error");
    setPlacing(true);

    try {
      const token = localStorage.getItem("token");
      const products = cart.products.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      await axios.post(
        `${API_URL}/api/orders/create`,
        {
          userId: user._id,
          products,
          totalAmount: getTotal(),
          shippingAddress: address,
          phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.dispatchEvent(
        new Event("auth-change")
      );

      window.showToast("Order placed successfully!", "success");

      window.dispatchEvent(
        new Event("auth-change")
      );

      navigate("/profile");

    } catch (err) {
      window.showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setPlacing(false);
    }
  };

  if (!cart) return <p style={{ padding: "40px 20px", color: "var(--text)", textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--heading)", fontSize: "42px", color: "var(--text-h)", marginBottom: "30px", textAlign: "left" }}>
        Checkout
      </h1>

      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "30px",
        boxShadow: "var(--shadow)",
        marginBottom: "30px",
        textAlign: "left"
      }}>
        <h3 style={{ fontFamily: "var(--heading)", fontSize: "22px", color: "var(--accent)", marginTop: 0, marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>Order Summary</h3>
        {cart.products?.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid var(--border)",
              fontSize: "14px",
              color: "var(--text)",
            }}
          >
            <span>{item.productId.name} × {item.quantity}</span>
            <span style={{ color: "var(--text-h)" }}>₹{item.productId.price * item.quantity}</span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
            fontWeight: "600",
            fontSize: "18px",
            color: "var(--text-h)",
          }}
        >
          <span>Total</span>
          <span style={{ color: "var(--accent)", fontFamily: "var(--heading)", fontSize: "22px" }}>₹{getTotal()}</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "30px",
        boxShadow: "var(--shadow)",
        textAlign: "left"
      }}>
        <h3 style={{ fontFamily: "var(--heading)", fontSize: "22px", color: "var(--accent)", marginTop: 0, marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>Shipping Details</h3>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "var(--text)" }}>
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
            required
            style={{ width: "100%", padding: "10px 14px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "var(--text)" }}>
            Delivery Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            required
            rows={3}
            style={{ width: "100%", padding: "10px 14px", boxSizing: "border-box" }}
          />
        </div>

        <div
          style={{
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            padding: "12px 16px",
            borderRadius: "4px",
            marginBottom: "24px",
            fontSize: "13px",
            color: "var(--accent)",
          }}
        >
          💳 Payment is simulated — no real charge will be made.
        </div>

        <button
          type="submit"
          disabled={placing}
          style={{ padding: "12px 30px", width: "100%", cursor: "pointer" }}
        >
          {placing ? "Placing Order..." : "Place Order →"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
