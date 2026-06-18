import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

function AdminDashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const productsRes = await axios.get(
        `${API_URL}/api/products`
      );

      const ordersRes = await axios.get(
        `${API_URL}/api/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orders = ordersRes.data;

      const revenue = orders.reduce((sum, order) => sum + order.totalAmount,0);

setTotalRevenue(revenue);

      setTotalProducts(productsRes.data.length);
      setTotalOrders(orders.length);

      setPendingOrders(
        orders.filter(
          (order) => order.status === "Pending"
        ).length
      );

      setDeliveredOrders(
        orders.filter(
          (order) => order.status === "Delivered"
        ).length
      );

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!user || user.usertype !== "Admin") {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#000",
        }}
      >
        <h2>Access Denied</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "45px",
          color: "var(--text-h)",
          fontFamily: "var(--heading)",
          fontSize: "42px",
        }}
      >
        Admin Dashboard
      </h1>

      {}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            background: "var(--card-bg)",
            padding: "25px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "var(--shadow)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            style={{
              color: "var(--stone-taupe)",
              marginBottom: "10px",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Total Products
          </h3>
          <h1
            style={{
              color: "var(--text-h)",
              fontWeight: "600",
              fontSize: "36px",
              margin: 0,
            }}
          >
            {totalProducts}
          </h1>
        </div>

        <div
          style={{
            background: "var(--card-bg)",
            padding: "25px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "var(--shadow)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            style={{
              color: "var(--stone-taupe)",
              marginBottom: "10px",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Total Orders
          </h3>
          <h1
            style={{
              color: "var(--text-h)",
              fontWeight: "600",
              fontSize: "36px",
              margin: 0,
            }}
          >
            {totalOrders}
          </h1>
        </div>

        <div
          style={{
            background: "var(--card-bg)",
            padding: "25px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "var(--shadow)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            style={{
              color: "var(--olive-gold)",
              marginBottom: "10px",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Pending Orders
          </h3>
          <h1
            style={{
              color: "var(--olive-gold)",
              fontWeight: "600",
              fontSize: "36px",
              margin: 0,
            }}
          >
            {pendingOrders}
          </h1>
        </div>

        <div
          style={{
            background: "var(--card-bg)",
            padding: "25px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "var(--shadow)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            style={{
              color: "var(--accent)",
              marginBottom: "10px",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Delivered Orders
          </h3>
          <h1
            style={{
              color: "var(--accent)",
              fontWeight: "600",
              fontSize: "36px",
              margin: 0,
            }}
          >
            {deliveredOrders}
          </h1>
        </div>
      </div>

      <div
        style={{
          background: "var(--card-bg)",
          color: "var(--text-h)",
          padding: "30px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          textAlign: "center",
          boxShadow: "var(--shadow)",
          marginBottom: "50px",
        }}
      >
        <h3
          style={{
            color: "var(--stone-taupe)",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            fontSize: "15px",
            marginBottom: "12px",
            marginTop: 0,
          }}
        >
          Total Revenue
        </h3>
        <h1
          style={{
            color: "var(--accent)",
            fontSize: "46px",
            fontWeight: "600",
            fontFamily: "var(--heading)",
            margin: 0,
          }}
        >
          ₹{totalRevenue}
        </h1>
      </div>

      {}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/admin/products" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "260px",
              height: "100px",
              fontSize: "16px",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "var(--shadow)",
            }}
          >
            Manage Products
          </button>
        </Link>

        <Link to="/admin/orders" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "260px",
              height: "100px",
              fontSize: "16px",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "var(--shadow)",
            }}
          >
            Manage Orders
          </button>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;