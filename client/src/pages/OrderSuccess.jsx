import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ maxWidth: "580px", padding: "4rem 1.5rem" }}>
        <div
          style={{
            border: "1.5px solid hsl(var(--text-primary))",
            backgroundColor: "hsl(var(--bg-card))",
            padding: "3rem 2rem",
            position: "relative",
          }}
        >
          {/* Stark Rose Border Element */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: "hsl(var(--accent))" }} />

          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "hsl(var(--accent))",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Transaction Completed
          </span>

          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              marginBottom: "1rem",
              letterSpacing: "-0.03em",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            Order Confirmed
          </h1>
          
          <p
            style={{
              color: "hsl(var(--text-secondary))",
              fontSize: "0.95rem",
              lineHeight: "1.75",
              marginBottom: "2.5rem",
              textAlign: "center",
            }}
          >
            Thank you for shopping with ShopEZ. The simulated payment process completed successfully. The dispatch pipeline has been notified, and your items are scheduled for packaging.
          </p>

          <div
            style={{
              backgroundColor: "hsl(var(--bg-secondary))",
              border: "1.5px solid hsl(var(--text-primary))",
              padding: "1.25rem",
              fontSize: "0.85rem",
              color: "hsl(var(--text-primary))",
              marginBottom: "2.5rem",
            }}
          >
            <span style={{ display: "block", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
              Next Phases
            </span>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "6px", color: "hsl(var(--text-secondary))" }}>
              <li>
                A confirmation ledger has been logged.
              </li>
              <li>
                You can track shipment dispatch steps on your <strong>Profile Dashboard</strong>.
              </li>
              <li>
                Flat 5% GST invoicing details are saved to your transaction history.
              </li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/profile" style={{ flex: "1 1 200px" }}>
              <button className="btn btn-secondary" style={{ width: "100%", height: "46px" }}>
                Track Order
              </button>
            </Link>
            <Link to="/products" style={{ flex: "1 1 200px" }}>
              <button className="btn btn-primary" style={{ width: "100%", height: "46px" }}>
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
