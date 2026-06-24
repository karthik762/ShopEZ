import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("auth-change"));
      showToast("Login successful!");
      if (res.data.user.usertype === "Admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Login failed",
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
          Catalog Access
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
            Access<br />
            Catalog<span style={{ color: "hsl(var(--accent))" }}>.</span>
          </h1>
          <p style={{ fontSize: "1.05rem", color: "hsl(var(--text-muted))", maxWidth: "400px", lineHeight: "1.6" }}>
            Sign in to view your personalized cart, track active shipments, and browse our clean, noise-free inventory.
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
            Sign In
          </h2>
          <p style={{ color: "hsl(var(--text-secondary))", fontSize: "0.875rem", marginBottom: "2rem" }}>
            Enter your credentials to manage your account details.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem", height: "46px" }}>
              Sign In
            </button>
          </form>

          <p style={{ marginTop: "2rem", fontSize: "0.85rem", color: "hsl(var(--text-secondary))", textAlign: "center" }}>
            New to our catalog?{" "}
            <Link to="/register" style={{ fontWeight: 700, textDecoration: "underline" }}>
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;