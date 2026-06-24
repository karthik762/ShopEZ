import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../config";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const fetchCartCount = async (userId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/cart/${userId}`
      );

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

          if (
            parsedUser.usertype !== "Admin"
          ) {
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

    window.addEventListener(
      "storage",
      loadUser
    );

    window.addEventListener(
      "auth-change",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );

      window.removeEventListener(
        "auth-change",
        loadUser
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setCartCount(0);

    window.dispatchEvent(
      new Event("auth-change")
    );

    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo-container">
        <Link to="/" className="navbar-logo">
          ShopEZ
        </Link>
        <p className="navbar-subtitle">
          Shop with Ease
        </p>
      </div>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          Home
        </Link>

        <Link to="/products" className="navbar-link">
          Products
        </Link>

        {user ? (
          <>
            {user.usertype === "Admin" ? (
              <Link to="/admin" className="navbar-link navbar-link-admin">
                Admin Dashboard
              </Link>
            ) : (
              <>
                <Link to="/cart" className="navbar-link">
                  Cart ({cartCount})
                </Link>

                <Link to="/profile" className="navbar-link navbar-link-profile">
                  Hi, {user.username}
                </Link>
              </>
            )}

            <button onClick={handleLogout} className="navbar-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>

            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;