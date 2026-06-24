import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("auth-change"));
      window.showToast("Login Successful!", "success");
      if (res.data.user.usertype === "Admin") {
        navigate("/admin");
      } 
      else {
        navigate("/products");
      }
    } catch (error) {
      window.showToast(
        error.response?.data?.message || "Login Failed",
        "error"
      );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "40px",
        boxShadow: "var(--shadow)",
        textAlign: "left",
      }}>
        <h1 style={{ fontFamily: "var(--heading)", fontSize: "36px", color: "var(--text-h)", marginTop: 0, marginBottom: "30px", textAlign: "center" }}>
          Login
        </h1>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", color: "var(--text)", textTransform: "uppercase", letterSpacing: "1px" }}>Email</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", color: "var(--text)", textTransform: "uppercase", letterSpacing: "1px" }}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <button type="submit" style={{ padding: "14px", width: "100%", marginTop: "10px" }}>
            Sign In
          </button>

          <p style={{ margin: "10px 0 0", fontSize: "14px", color: "var(--stone-taupe)", textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "600" }}>
              Register Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Login;