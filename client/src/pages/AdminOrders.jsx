import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/orders/status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.showToast("Status Updated!", "success");

      fetchOrders();

    } catch (error) {
      console.log(error);
      window.showToast("Update Failed", "error");
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
      <h1 style={{ fontFamily: "var(--heading)", fontSize: "42px", color: "var(--text-h)", marginBottom: "35px" }}>
        Manage Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid var(--border)",
            backgroundColor: "var(--card-bg)",
            padding: "24px",
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: "1px dashed var(--border)", paddingBottom: "12px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontFamily: "var(--heading)", fontSize: "22px", color: "var(--text-h)" }}>
                Customer: {order.userId?.username || "Guest"}
              </h3>
              <p style={{ margin: 0, color: "var(--text)", fontSize: "14px", opacity: 0.8 }}>
                {order.userId?.email}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "13px", color: "var(--stone-taupe)" }}>Status Control</span>
              <br />
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                style={{
                  padding: "6px 12px",
                  marginTop: "6px",
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "16px" }}>
            <div>
              <h4 style={{ margin: "0 0 8px", fontFamily: "var(--heading)", fontSize: "16px", color: "var(--accent)" }}>Products Ordered</h4>
              {order.products.map((item) => (
                <div key={item._id} style={{ fontSize: "14px", padding: "4px 0", color: "var(--text)" }}>
                  • {item.productId?.name || "Product"} × {item.quantity}
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ margin: "0 0 8px", fontFamily: "var(--heading)", fontSize: "16px", color: "var(--accent)" }}>Shipping Info</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text)", lineHeight: "1.4" }}>
                <strong>Address:</strong> {order.shippingAddress}
              </p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "var(--stone-taupe)" }}>Order Ref: {order._id}</span>
            <span style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-h)" }}>
              Total: <span style={{ color: "var(--accent)" }}>₹{order.totalAmount}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;