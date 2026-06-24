import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/orders/${user._id}`,
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
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const statusList = ["Pending", "Processing", "Shipped", "Delivered"];
  
  const getStatusIndex = (status) => {
    return statusList.indexOf(status);
  };

  const statusBadgeStyle = (status) => {
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

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        {/* Profile Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3rem",
            paddingBottom: "1.5rem",
            borderBottom: "1.5px solid hsl(var(--text-primary))",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
              Hi, {user.username} 👋
            </h1>
            <p style={{ margin: "6px 0 0", color: "hsl(var(--text-secondary))", fontSize: "0.95rem" }}>
              Manage your delivery registry and track purchases.
            </p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Left Side: Account Info */}
          <div
            style={{
              border: "1.5px solid hsl(var(--text-primary))",
              backgroundColor: "hsl(var(--bg-card))",
              padding: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                marginBottom: "1.5rem",
                borderBottom: "1px solid hsl(var(--border))",
                paddingBottom: "0.5rem",
                textTransform: "uppercase",
              }}
            >
              Account Info
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <span style={{ fontSize: "0.7rem", color: "hsl(var(--text-muted))", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Email Address</span>
                <p style={{ margin: "2px 0 0", color: "hsl(var(--text-primary))", fontWeight: 600, fontSize: "0.9rem" }}>{user.email}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", color: "hsl(var(--text-muted))", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Phone Number</span>
                <p style={{ margin: "2px 0 0", color: "hsl(var(--text-primary))", fontWeight: 600, fontSize: "0.9rem" }}>{user.phone || "—"}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", color: "hsl(var(--text-muted))", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Default Shipping Well</span>
                <p style={{ margin: "2px 0 0", color: "hsl(var(--text-primary))", fontWeight: 600, fontSize: "0.9rem", lineHeight: "1.4" }}>{user.address || "—"}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", color: "hsl(var(--text-muted))", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Registry Tier</span>
                <p style={{ margin: "4px 0 0" }}>
                  <span
                    className="badge"
                    style={{
                      border: "1px solid hsl(var(--text-primary))",
                      color: "hsl(var(--text-primary))",
                      padding: "2px 8px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    }}
                  >
                    {user.usertype}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Order History */}
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
              Order History
            </h2>

            {loading ? (
              <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-secondary))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 1.5rem",
                  border: "1.5px solid hsl(var(--text-primary))",
                  backgroundColor: "hsl(var(--bg-card))",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.9rem", color: "hsl(var(--text-secondary))" }}>No orders have been submitted yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {orders.map((order) => {
                  const currentStatusIdx = getStatusIndex(order.status);
                  return (
                    <div
                      key={order._id}
                      style={{
                        border: "1.5px solid hsl(var(--text-primary))",
                        backgroundColor: "hsl(var(--bg-card))",
                        padding: "1.5rem",
                      }}
                    >
                      {/* Order Details Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "1rem",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "0.7rem", color: "hsl(var(--text-muted))", fontFamily: "monospace", fontWeight: 600 }}>
                            ORDER: #{order._id.toUpperCase()}
                          </span>
                          <div style={{ fontSize: "0.8rem", color: "hsl(var(--text-secondary))", marginTop: "2px", fontWeight: 600 }}>
                            Placed on: {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <span
                          className="badge"
                          style={{
                            padding: "3px 10px",
                            fontSize: "0.65rem",
                            ...statusBadgeStyle(order.status),
                          }}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Order Items */}
                      <div
                        style={{
                          borderTop: "1px solid hsl(var(--border))",
                          borderBottom: "1px solid hsl(var(--border))",
                          padding: "0.75rem 0",
                          marginBottom: "1rem",
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
                              <span style={{ color: "hsl(var(--text-muted))", marginLeft: "6px", fontWeight: 500 }}>
                                × {item.quantity}
                              </span>
                            </span>
                            <span style={{ fontWeight: 700, color: "hsl(var(--text-primary))" }}>
                              ₹{Number(item.productId?.price * item.quantity).toLocaleString("en-IN")}.00
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Total */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          marginBottom: "1.25rem",
                        }}
                      >
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Charged</span>
                        <span style={{ color: "hsl(var(--text-primary))", fontSize: "1.25rem", fontWeight: 700 }}>
                          ₹{Number(order.totalAmount).toLocaleString("en-IN")}.00
                        </span>
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div
                          style={{
                            backgroundColor: "hsl(var(--bg-secondary))",
                            padding: "8px 12px",
                            fontSize: "0.75rem",
                            color: "hsl(var(--text-secondary))",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            border: "1px solid hsl(var(--border))",
                            marginBottom: "1.5rem",
                            lineHeight: "1.4",
                            fontWeight: 500,
                          }}
                        >
                          📦 Destination: {order.shippingAddress}
                        </div>
                      )}

                      {/* Simplified Stark Status Timeline */}
                      <div style={{ borderTop: "1px solid hsl(var(--border))", paddingTop: "1rem" }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.7rem",
                            color: "hsl(var(--text-muted))",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            marginBottom: "12px",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Tracking Timeline
                        </span>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            position: "relative",
                            padding: "0 6px",
                          }}
                        >
                          {/* Connecting Track */}
                          <div
                            style={{
                              position: "absolute",
                              top: "7px",
                              left: "20px",
                              right: "20px",
                              height: "1px",
                              backgroundColor: "hsl(var(--border))",
                              zIndex: 1,
                            }}
                          />

                          {/* Active Track Highlight */}
                          {currentStatusIdx > 0 && (
                            <div
                              style={{
                                position: "absolute",
                                top: "7px",
                                left: "20px",
                                width: `${(currentStatusIdx / (statusList.length - 1)) * 90}%`,
                                height: "1px",
                                backgroundColor: "hsl(var(--text-primary))",
                                zIndex: 2,
                              }}
                            />
                          )}

                          {statusList.map((stepName, idx) => {
                            const isDone = currentStatusIdx >= idx;
                            const isCurrent = currentStatusIdx === idx;

                            return (
                              <div
                                key={stepName}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  zIndex: 3,
                                  width: "55px",
                                }}
                              >
                                {/* Step Circle (Squared Box) */}
                                <div
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    backgroundColor: isDone ? "hsl(var(--text-primary))" : "hsl(var(--bg-card))",
                                    border: isDone ? "1.5px solid hsl(var(--text-primary))" : "1.5px solid hsl(var(--border))",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: isCurrent ? "0 0 0 3px hsl(var(--accent), 0.15)" : "none",
                                    transition: "var(--transition)",
                                  }}
                                />
                                {/* Step Text Label */}
                                <span
                                  style={{
                                    fontSize: "0.65rem",
                                    marginTop: "6px",
                                    color: isDone ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
                                    fontWeight: isDone ? 700 : 500,
                                    textAlign: "center",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.02em",
                                  }}
                                >
                                  {stepName}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
