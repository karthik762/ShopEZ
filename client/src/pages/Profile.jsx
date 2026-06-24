import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/api/orders/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const statusColor = (status) => {
    const map = {
      Pending: "#8A8660", 
      Processing: "#6B6552", 
      Shipped: "#4A4535", 
      Delivered: "#C8B87A", 
    };
    return map[status] || "#6B6552";
  };

  if (!user) return null;

  return (
    <div style={{ padding: "40px 20px", maxWidth: "700px", margin: "0 auto", textAlign: "left" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "40px",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 8px", fontFamily: "var(--heading)", fontSize: "36px", color: "var(--text-h)" }}>
            Hi, {user.username} 👋
          </h1>
          <p style={{ margin: 0, color: "var(--text)", fontStyle: "italic" }}>{user.email}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: "8px 20px" }}>
          Logout
        </button>
      </div>

      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "24px 30px",
          marginBottom: "40px",
          boxShadow: "var(--shadow)",
        }}
      >
        <h3 style={{ margin: "0 0 16px", fontFamily: "var(--heading)", fontSize: "22px", color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Account Details</h3>
        <p style={{ margin: "8px 0" }}><strong>Phone:</strong> {user.phone || "—"}</p>
        <p style={{ margin: "8px 0" }}><strong>Address:</strong> {user.address || "—"}</p>
        <p style={{ margin: "8px 0" }}><strong>Account Type:</strong> <span style={{ color: "var(--accent)", fontWeight: "500" }}>{user.usertype}</span></p>
      </div>

      <h2 style={{ marginBottom: "20px", fontFamily: "var(--heading)", fontSize: "28px", color: "var(--text-h)" }}>Order History</h2>

      {loading ? (
        <p style={{ color: "var(--text)", fontStyle: "italic" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: "var(--text)", fontStyle: "italic" }}>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--card-bg)",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--stone-taupe)" }}>
                  Order ID: {order._id}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--stone-taupe)" }}>
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>
              </div>
              <span
                style={{
                  border: `1px solid ${statusColor(order.status)}`,
                  color: statusColor(order.status),
                  padding: "4px 14px",
                  borderRadius: "2px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: "600",
                }}
              >
                {order.status}
              </span>
            </div>

            {order.products.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderTop: "1px solid var(--border)",
                  fontSize: "14px",
                  color: "var(--text)",
                }}
              >
                <span>{item.productId?.name || "Product"} × {item.quantity}</span>
                <span style={{ color: "var(--text-h)" }}>₹{item.productId?.price * item.quantity}</span>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid var(--border)",
                fontWeight: "600",
                fontSize: "16px",
                color: "var(--text-h)",
              }}
            >
              <span>Total</span>
              <span style={{ color: "var(--accent)" }}>₹{order.totalAmount}</span>
            </div>

            {order.shippingAddress && (
              <p style={{ margin: "12px 0 0", fontSize: "13px", color: "var(--stone-taupe)", borderTop: "1px dashed var(--border)", paddingTop: "8px" }}>
                📦 Ships to: {order.shippingAddress}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;
