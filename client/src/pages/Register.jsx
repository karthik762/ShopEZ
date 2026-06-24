import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        formData
      );

      window.showToast("Registration Successful!", "success");

      setFormData({
        username: "",
        email: "",
        password: "",
        address: "",
        phone: "",
      });

      navigate("/login");
    } catch (error) {
      window.showToast(
        error.response?.data?.message || "Registration Failed",
        "error"
      );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "40px",
        boxShadow: "var(--shadow)",
        textAlign: "left",
      }}>
        <h1 style={{ fontFamily: "var(--heading)", fontSize: "36px", color: "var(--text-h)", marginTop: 0, marginBottom: "30px", textAlign: "center" }}>
          Register
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "var(--text)", textTransform: "uppercase", letterSpacing: "1px" }}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "var(--text)", textTransform: "uppercase", letterSpacing: "1px" }}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "var(--text)", textTransform: "uppercase", letterSpacing: "1px" }}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "var(--text)", textTransform: "uppercase", letterSpacing: "1px" }}>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", color: "var(--text)", textTransform: "uppercase", letterSpacing: "1px" }}>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Delivery address"
              value={formData.address}
              onChange={handleChange}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <button type="submit" style={{ padding: "14px", width: "100%", marginTop: "15px" }}>
            Register
          </button>

          <p style={{ margin: "10px 0 0", fontSize: "14px", color: "var(--stone-taupe)", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "600" }}>
              Login Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;