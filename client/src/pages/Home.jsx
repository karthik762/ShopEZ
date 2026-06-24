import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [banner, setBanner] = useState("");
  const [recommended, setRecommended] = useState([]);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    fetchBanner();
    fetchRecommended();
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/settings");
      if (res.data && res.data.banner) {
        setBanner(res.data.banner);
      }
    } catch (error) {
      console.error("Error fetching homepage settings:", error);
    }
  };

  const fetchRecommended = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const shuffled = [...res.data].sort(() => 0.5 - Math.random());
      setRecommended(shuffled.slice(0, 4));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {banner && (
        <div
          style={{
            backgroundColor: "hsl(var(--accent))",
            color: "#ffffff",
            padding: "12px 20px",
            textAlign: "center",
            fontWeight: "700",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            borderBottom: "1.5px solid hsl(var(--text-primary))",
          }}
        >
          {banner}
        </div>
      )}

      {/* Asymmetric Hero Section */}
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "2.5rem",
          paddingTop: "6rem",
          paddingBottom: "5rem",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <div style={{ flex: "1 1 500px", maxWidth: "650px" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              lineHeight: "1.05",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              marginBottom: "1.5rem",
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
            }}
          >
            Stark Utility.<br />
            Honest Craft<span style={{ color: "hsl(var(--accent))" }}>.</span>
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.65",
              color: "hsl(var(--text-secondary))",
              marginBottom: "2rem",
            }}
          >
            We curate tech essentials, premium fashion wear, and select literature for the minimalist lifestyle. Grounded in transparency: direct catalog sourcing, flat 5% GST billing, and free delivery across India for orders above ₹2,000.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/products">
              <button className="btn btn-primary btn-lg">Explore Catalog</button>
            </Link>
            {!user ? (
              <Link to="/register">
                <button className="btn btn-secondary btn-lg">Join Account</button>
              </Link>
            ) : (
              <Link to="/profile">
                <button className="btn btn-secondary btn-lg">View Profile</button>
              </Link>
            )}
          </div>
        </div>
        <div
          style={{
            flex: "1 1 300px",
            fontSize: "0.85rem",
            color: "hsl(var(--text-secondary))",
            borderLeft: "2px solid hsl(var(--text-primary))",
            paddingLeft: "1.5rem",
            paddingTop: "1rem",
            maxWidth: "350px",
            marginTop: "1.5rem",
          }}
        >
          <span style={{ display: "block", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(var(--text-primary))", marginBottom: "8px" }}>
            ShopEZ Policy
          </span>
          No hidden fees. No artificial markups. We supply real products in working stock. Orders processed in 24 hours, delivered straight to your door with tracking support.
        </div>
      </div>

      {/* Grounded Value Propositions */}
      <div
        className="container grid grid-cols-3"
        style={{
          paddingTop: "4rem",
          paddingBottom: "4rem",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <div style={{ padding: "0.5rem" }}>
          <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--accent))", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>01 / Curated Catalog</span>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", marginBottom: "8px" }}>Zero Choice Fatigue</h3>
          <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-secondary))", margin: 0 }}>
            We source high-quality tech gear, clean apparel, and select print literature to shield you from algorithmic clutter.
          </p>
        </div>

        <div style={{ padding: "0.5rem" }}>
          <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--accent))", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>02 / Clean Billing</span>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", marginBottom: "8px" }}>Flat 5% GST Transparency</h3>
          <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-secondary))", margin: 0 }}>
            No surprise checkouts. Taxes are strictly itemized at a flat 5% rate with standard shipping thresholds.
          </p>
        </div>

        <div style={{ padding: "0.5rem" }}>
          <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--accent))", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>03 / Secure Transit</span>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", marginBottom: "8px" }}>Domestic Deliveries</h3>
          <p style={{ fontSize: "0.85rem", color: "hsl(var(--text-secondary))", margin: 0 }}>
            Insured parcel tracking to all major cities. Subtotals exceeding ₹2,000 automatically qualify for free shipping.
          </p>
        </div>
      </div>

      {/* Recommended Products Grid */}
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-display)", margin: 0 }}>
            Catalog Highlights
          </h2>
          <Link to="/products" style={{ fontSize: "0.825rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(var(--text-primary))", borderBottom: "1.5px solid currentColor" }}>
            See All Items
          </Link>
        </div>

        <div className="grid grid-cols-4">
          {recommended.map((product) => (
            <div
              key={product._id}
              className="card card-hover"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                padding: "1rem",
              }}
            >
              <div>
                {product.image ? (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      overflow: "hidden",
                      marginBottom: "12px",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: "hsl(var(--bg-secondary))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      color: "hsl(var(--text-muted))",
                      marginBottom: "12px",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    No Image available
                  </div>
                )}
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "hsl(var(--text-muted))",
                  }}
                >
                  {product.category}
                </span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "var(--font-display)", margin: "4px 0 8px" }}>
                  {product.name}
                </h3>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "1rem", color: "hsl(var(--text-primary))", marginBottom: "12px", fontFamily: "var(--font-body)" }}>
                  ₹{Number(product.price).toLocaleString("en-IN")}.00
                </p>
                <Link to={`/product/${product._id}`} style={{ display: "block" }}>
                  <button className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                    View Product
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;