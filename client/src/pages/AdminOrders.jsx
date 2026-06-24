import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import { useToast } from "../components/Toast";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast(`Order status updated to: ${status}`, "success");
      fetchOrders();
    } catch (error) {
      console.log(error);
      showToast("Failed to update status.", "error");
    }
  };

  const getCount = (statusName) => {
    if (statusName === "All") return orders.length;
    return orders.filter((order) => order.status === statusName).length;
  };

  const statusOptions = ["All", "Pending", "Processing", "Shipped", "Delivered"];

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { borderColor: "hsl(var(--warning))", color: "hsl(var(--warning))" };
      case "Processing":
        return { borderColor: "hsl(var(--accent))", color: "hsl(var(--accent))" };
      case "Shipped":
      case "Delivered":
        return { borderColor: "hsl(var(--success))", color: "hsl(var(--success))" };
      default:
        return { borderColor: "hsl(var(--border))", color: "hsl(var(--text-secondary))" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
      <AdminHeader />

      <div className="container" style={{ maxWidth: "1100px", paddingBottom: "6rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-display)", textTransform: "uppercase", margin: 0 }}>
            Manage Purchases
          </h1>
          <p style={{ color: "hsl(var(--text-secondary))", margin: "6px 0 0", fontSize: "0.95rem" }}>
            Monitor customer order states and manage dispatch schedules.
          </p>
        </div>

        {loading ? (
          <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Loading orders list...</p>
        ) : (
          <>
            {/* Status Filter Tab Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1.25rem",
                overflowX: "auto",
                paddingBottom: "8px",
                marginBottom: "2.5rem",
                borderBottom: "1.5px solid hsl(var(--text-primary))",
              }}
            >
              {statusOptions.map((opt) => {
                const isActive = filter === opt;
                const count = getCount(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "0.25rem 0",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      transition: "var(--transition)",
                      color: isActive ? "hsl(var(--accent))" : "hsl(var(--text-secondary))",
                      borderBottom: isActive ? "2px solid hsl(var(--accent))" : "2px solid transparent",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>{opt}</span>
                    <span style={{ fontSize: "0.7rem", color: "hsl(var(--text-muted))" }}>({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Orders Listing */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    border: "1.5px solid hsl(var(--text-primary))",
                    backgroundColor: "hsl(var(--bg-card))",
                    padding: "1.5rem",
                  }}
                >
                  {/* Order Card Title Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "hsl(var(--text-muted))",
                          fontFamily: "monospace",
                          fontWeight: 600,
                        }}
                      >
                        ORDER ID: #{order._id.toUpperCase()}
                      </span>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "var(--font-display)", margin: "4px 0 2px" }}>
                        {order.userId?.username || "Guest Customer"}
                      </h3>
                      <p style={{ fontSize: "0.825rem", color: "hsl(var(--text-secondary))", margin: 0, fontWeight: 500 }}>
                        {order.userId?.email || "No email available"} • Ordered on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                      <span
                        className="badge"
                        style={{
                          padding: "3px 10px",
                          fontSize: "0.65rem",
                          ...getStatusStyle(order.status),
                        }}
                      >
                        {order.status}
                      </span>
                      
                      {/* Styled Action Select Dropdown */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.7rem", color: "hsl(var(--text-muted))", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Fulfillment:</span>
                        <select
                          className="form-input"
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.8rem",
                            width: "130px",
                            cursor: "pointer",
                            height: "30px",
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Product Rows List */}
                  <div
                    style={{
                      backgroundColor: "hsl(var(--bg-secondary))",
                      border: "1px solid hsl(var(--border))",
                      padding: "0.75rem 1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.85rem",
                          padding: "4px 0",
                        }}
                      >
                        <span style={{ color: "hsl(var(--text-primary))", fontWeight: 600 }}>
                          {item.productId?.name || "Deleted Product"}
                          <span style={{ color: "hsl(var(--text-muted))", marginLeft: "8px", fontWeight: 500 }}>
                            × {item.quantity}
                          </span>
                        </span>
                        <span style={{ fontWeight: 700 }}>
                          ₹{Number(item.productId?.price * item.quantity).toLocaleString("en-IN")}.00
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Card Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    {order.shippingAddress && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.75rem",
                          color: "hsl(var(--text-secondary))",
                          backgroundColor: "hsl(var(--bg-secondary))",
                          padding: "6px 12px",
                          border: "1px solid hsl(var(--border))",
                          fontWeight: 500,
                        }}
                      >
                        📦 Destination: {order.shippingAddress}
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginLeft: "auto" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Charged:</span>
                      <span style={{ fontSize: "1.35rem", fontWeight: 700, color: "hsl(var(--text-primary))" }}>
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}.00
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 1.5rem",
                    border: "1.5px solid hsl(var(--text-primary))",
                    backgroundColor: "hsl(var(--bg-card))",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "0.90rem", color: "hsl(var(--text-secondary))" }}>No orders match the selected status filter.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;