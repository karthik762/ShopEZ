import { Link } from "react-router-dom";

function Home() {

  const user = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("user")
      );
    } catch {
      return null;
    }
  })();

  return (
    <>
      <div
        style={{
          textAlign: "center",
          padding: "100px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "64px",
            fontFamily: "var(--heading)",
            color: "var(--text-h)",
            marginBottom: "16px",
          }}
        >
          Welcome to ShopEZ
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "var(--text)",
            maxWidth: "600px",
            margin: "0 auto 40px",
            fontStyle: "italic",
          }}
        >
          Your One Stop Destination For Online Shopping
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <Link to="/products">
            <button
              style={{
                padding: "14px 30px",
              }}
            >
              Shop Now
            </button>
          </Link>

          {!user && (
            <Link to="/register">
              <button
                style={{
                  padding: "14px 30px",
                  backgroundColor: "transparent",
                  color: "var(--accent)",
                  border: "1px solid var(--accent)",
                }}
              >
                Register
              </button>
            </Link>
          )}

          {user && (
            <Link to="/profile">
              <button
                style={{
                  padding: "14px 30px",
                  backgroundColor: "transparent",
                  color: "var(--accent)",
                  border: "1px solid var(--accent)",
                }}
              >
                My Profile
              </button>
            </Link>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          marginTop: "20px",
          padding: "0 20px 80px",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "35px 24px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3 style={{ color: "var(--accent)", margin: "0 0 12px", fontFamily: "var(--heading)", fontSize: "22px" }}>Wide Product Range</h3>
          <p style={{ color: "var(--text)", fontSize: "14px", margin: 0 }}>Explore products across categories.</p>
        </div>

        <div
          style={{
            flex: 1,
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "35px 24px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3 style={{ color: "var(--accent)", margin: "0 0 12px", fontFamily: "var(--heading)", fontSize: "22px" }}>Secure Checkout</h3>
          <p style={{ color: "var(--text)", fontSize: "14px", margin: 0 }}>Your information stays protected.</p>
        </div>

        <div
          style={{
            flex: 1,
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "35px 24px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3 style={{ color: "var(--accent)", margin: "0 0 12px", fontFamily: "var(--heading)", fontSize: "22px" }}>Fast Delivery</h3>
          <p style={{ color: "var(--text)", fontSize: "14px", margin: 0 }}>Quick delivery to your doorstep.</p>
        </div>
      </div>
    </>
  );
}

export default Home;