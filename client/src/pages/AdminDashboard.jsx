import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const productsRes = await axios.get("http://localhost:5000/api/products");
      const ordersRes = await axios.get("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orders = ordersRes.data;
      const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      setTotalRevenue(revenue);
      setTotalProducts(productsRes.data.length);
      setTotalOrders(orders.length);
      setPendingOrders(orders.filter((order) => order.status === "Pending").length);
      setDeliveredOrders(orders.filter((order) => order.status === "Delivered").length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!user || user.usertype !== "Admin") {
    return (
      <div className="container" style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <h2 style={{ fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>Access Denied</h2>
        <p style={{ color: "hsl(var(--text-secondary))" }}>
          Administrative privileges are required to view this registry dashboard.
        </p>
      </div>
    );
  }

  const metrics = [
    {
      title: "Active Catalog Items",
      value: totalProducts,
      color: "hsl(var(--text-primary))",
    },
    {
      title: "Total Purchases",
      value: totalOrders,
      color: "hsl(var(--text-primary))",
    },
    {
      title: "Unresolved Orders",
      value: pendingOrders,
      color: "hsl(var(--accent))",
    },
    {
      title: "Fulfilled Shipments",
      value: deliveredOrders,
      color: "hsl(var(--success))",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
      <AdminHeader />

      <div className="container" style={{ maxWidth: "1100px", paddingBottom: "6rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-display)", textTransform: "uppercase", margin: 0 }}>
            Dashboard Overview
          </h1>
          <p style={{ color: "hsl(var(--text-secondary))", margin: "6px 0 0", fontSize: "0.95rem" }}>
            Real-time analytics and catalog configurations.
          </p>
        </div>

        {loading ? (
          <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Loading registry stats...</p>
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-4" style={{ marginBottom: "2rem" }}>
              {metrics.map((m) => (
                <div
                  key={m.title}
                  style={{
                    backgroundColor: "hsl(var(--bg-card))",
                    border: "1.5px solid hsl(var(--text-primary))",
                    padding: "1.5rem",
                    borderTop: `4px solid ${m.color}`,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.65rem",
                      color: "hsl(var(--text-muted))",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "8px",
                    }}
                  >
                    {m.title}
                  </span>
                  <h2 style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0, color: "hsl(var(--text-primary))", fontFamily: "var(--font-body)" }}>
                    {m.value}
                  </h2>
                </div>
              ))}
            </div>

            {/* Total Revenue Highlight Card */}
            <div
              style={{
                border: "1.5px solid hsl(var(--text-primary))",
                backgroundColor: "hsl(var(--bg-card))",
                padding: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1.5rem",
                marginBottom: "3.5rem",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "0.7rem",
                    color: "hsl(var(--text-secondary))",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: 0,
                  }}
                >
                  Accumulated Gross Revenue
                </h3>
                <h1
                  style={{
                    color: "hsl(var(--success))",
                    fontSize: "3rem",
                    fontWeight: 800,
                    margin: "8px 0 0",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  ₹{totalRevenue.toLocaleString("en-IN")}.00
                </h1>
              </div>
              <div
                style={{
                  border: "1px solid hsl(var(--success))",
                  color: "hsl(var(--success))",
                  padding: "12px 20px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                [ Verified Invoicing ]
              </div>
            </div>

            {/* Navigation Cards (Human-designed actions) */}
            <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(var(--text-secondary))", marginBottom: "1.25rem" }}>
              Quick Action Shortcuts
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
              }}
            >
              <Link to="/admin/products" style={{ textDecoration: "none" }}>
                <div
                  className="card card-hover"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "1.5px solid hsl(var(--text-primary))",
                    padding: "1.5rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-display)",
                        color: "hsl(var(--text-primary))",
                        marginBottom: "8px",
                      }}
                    >
                      Manage Products
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-secondary))", margin: 0, lineHeight: "1.5" }}>
                      Configure catalog pricing details, images, sizes, and tracking inventory levels.
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "1.5rem",
                      color: "hsl(var(--accent))",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Go to Products &rarr;
                  </div>
                </div>
              </Link>

              <Link to="/admin/orders" style={{ textDecoration: "none" }}>
                <div
                  className="card card-hover"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "1.5px solid hsl(var(--text-primary))",
                    padding: "1.5rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-display)",
                        color: "hsl(var(--text-primary))",
                        marginBottom: "8px",
                      }}
                    >
                      Fulfillment Orders
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-secondary))", margin: 0, lineHeight: "1.5" }}>
                      Monitor user purchase steps, view address ledgers, and transition order logistics.
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "1.5rem",
                      color: "hsl(var(--accent))",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Go to Orders &rarr;
                  </div>
                </div>
              </Link>

              <Link to="/admin/settings" style={{ textDecoration: "none" }}>
                <div
                  className="card card-hover"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "1.5px solid hsl(var(--text-primary))",
                    padding: "1.5rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-display)",
                        color: "hsl(var(--text-primary))",
                        marginBottom: "8px",
                      }}
                    >
                      General Settings
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-secondary))", margin: 0, lineHeight: "1.5" }}>
                      Manage catalog category tags and updates for the landing page promotional marquee.
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "1.5rem",
                      color: "hsl(var(--accent))",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Go to Settings &rarr;
                  </div>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;