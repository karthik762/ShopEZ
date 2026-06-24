import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const fetchCartCount = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await res.json();

      if (data?.products) {
        const totalItems = data.products.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.log(error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");

      if (stored) {
        try {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);

          if (parsedUser.usertype !== "Admin") {
            fetchCartCount(parsedUser._id);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
        setCartCount(0);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("auth-change", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("auth-change", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setCartCount(0);

    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.25rem 2rem",
        backgroundColor: "hsl(var(--bg-card))",
        borderBottom: "1.5px solid hsl(var(--text-primary))",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Branding */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "1.6rem",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: "hsl(var(--text-primary))",
              letterSpacing: "-0.03em",
            }}
          >
            ShopEZ<span style={{ color: "hsl(var(--accent))" }}>.</span>
          </h2>
        </Link>
        <span
          style={{
            fontSize: "0.6rem",
            color: "hsl(var(--text-muted))",
            marginTop: "2px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Curated Catalog
        </span>
      </div>

      {/* Nav Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
        <Link to="/" className="nav-link">
          Home
        </Link>

        <Link to="/products" className="nav-link">
          Products
        </Link>

        {user ? (
          <>
            {user.usertype === "Admin" ? (
              <Link to="/admin" className="nav-link" style={{ fontWeight: 700, color: "hsl(var(--accent))" }}>
                Admin Portal
              </Link>
            ) : (
              <>
                <Link to="/cart" className="nav-link">
                  Cart
                  <span
                    style={{
                      marginLeft: "4px",
                      backgroundColor: "hsl(var(--primary))",
                      color: "hsl(var(--bg-primary))",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 6px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cartCount}
                  </span>
                </Link>

                <Link to="/profile" className="nav-link" style={{ fontWeight: 700, color: "hsl(var(--accent))" }}>
                  Profile
                </Link>
              </>
            )}

            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>

            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;