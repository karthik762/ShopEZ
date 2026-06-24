import { Link, useLocation } from "react-router-dom";

function AdminHeader() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div
      style={{
        backgroundColor: "hsl(var(--bg-card))",
        borderBottom: "1.5px solid hsl(var(--text-primary))",
        padding: "1.25rem 2rem",
        marginBottom: "2.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              margin: 0,
              color: "hsl(var(--text-primary))",
              letterSpacing: "-0.02em",
            }}
          >
            Admin Panel
          </h2>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {links.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive ? "active" : ""}`}
                style={{
                  padding: "0.5rem 0.875rem",
                  fontSize: "0.75rem",
                  borderBottom: isActive ? "2px solid hsl(var(--accent))" : "2px solid transparent",
                  fontWeight: 700,
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
