import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
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
      await axios.post("http://localhost:5000/api/auth/register", formData);
      showToast("Registration successful!");
      setFormData({
        username: "",
        email: "",
        password: "",
        address: "",
        phone: "",
      });
      navigate("/login");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Registration failed",
        "error"
      );
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        minHeight: "calc(100vh - 84px)",
        backgroundColor: "hsl(var(--bg-primary))",
      }}
    >
      {/* Left Branding Panel */}
      <div
        style={{
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--bg-primary))",
          padding: "4rem 3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1.5px solid hsl(var(--text-primary))",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Catalog Registry
        </span>

        <div style={{ margin: "4rem 0" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "3.25rem",
              fontWeight: 800,
              lineHeight: "1.1",
              color: "inherit",
              marginBottom: "1.5rem",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            Create<br />
            Account<span style={{ color: "hsl(var(--accent))" }}>.</span>
          </h1>
          <p style={{ fontSize: "1.05rem", color: "hsl(var(--text-muted))", maxWidth: "400px", lineHeight: "1.6" }}>
            Join our curated shop registry to manage orders, secure transactions, and access transparent Indian logistics.
          </p>
        </div>

        <div style={{ fontSize: "0.75rem", color: "hsl(var(--text-muted))" }}>
          © ShopEZ India. Flat 5% GST Transparency.
        </div>
      </div>

      {/* Right Form Panel */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 2rem",
          backgroundColor: "hsl(var(--bg-primary))",
        }}
      >
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            Register
          </h2>
          <p style={{ color: "hsl(var(--text-secondary))", fontSize: "0.875rem", marginBottom: "2rem" }}>
            Enter your details to create a direct catalog profile.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Username *</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Create password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="10-digit number"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Delivery Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter shipping address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem", height: "46px" }}>
              Create Account
            </button>
          </form>

          <p style={{ marginTop: "2rem", fontSize: "0.85rem", color: "hsl(var(--text-secondary))", textAlign: "center" }}>
            Already registered?{" "}
            <Link to="/login" style={{ fontWeight: 700, textDecoration: "underline" }}>
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;