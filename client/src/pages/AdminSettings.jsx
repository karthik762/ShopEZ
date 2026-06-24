import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import { useToast } from "../components/Toast";

function AdminSettings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const { showToast } = useToast();

  const [banner, setBanner] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.usertype !== "Admin") {
      navigate("/");
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/settings");
        if (res.data) {
          setBanner(res.data.banner || "");
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        showToast(err.response?.data?.message || "Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user, navigate]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        "http://localhost:5000/api/admin/settings",
        { banner, categories },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast(res.data.message || "Settings updated successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update settings", "error");
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      showToast("Category already exists", "error");
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategory("");
    showToast(`Category "${trimmed}" added locally. Click Save Settings to submit.`, "info");
  };

  const handleRemoveCategory = (catToRemove) => {
    setCategories(categories.filter((cat) => cat !== catToRemove));
    showToast(`Category "${catToRemove}" removed locally. Click Save Settings to submit.`, "info");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
        <AdminHeader />
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Loading registry settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
      <AdminHeader />

      <div className="container" style={{ maxWidth: "700px", paddingBottom: "6rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-display)", textTransform: "uppercase", margin: 0 }}>
            Website Settings
          </h1>
          <p style={{ color: "hsl(var(--text-secondary))", margin: "6px 0 0", fontSize: "0.95rem" }}>
            Configure storefront banner promotions and catalog classifications.
          </p>
        </div>

        <div
          style={{
            border: "1.5px solid hsl(var(--text-primary))",
            backgroundColor: "hsl(var(--bg-card))",
            padding: "2rem",
          }}
        >
          <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Banner Section */}
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="banner" className="form-label" style={{ fontWeight: 700 }}>
                Homepage Promotional Banner
              </label>
              <textarea
                id="banner"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                className="form-input"
                style={{
                  minHeight: "90px",
                  resize: "vertical",
                  lineHeight: "1.5",
                }}
                placeholder="Write a banner announcement (e.g., Summer Special Sale - 20% OFF!). Leave empty to disable."
              />
            </div>

            {/* Categories Section */}
            <div style={{ borderTop: "1.5px solid hsl(var(--text-primary))", paddingTop: "1.5rem" }}>
              <label className="form-label" style={{ fontWeight: 700, marginBottom: "8px" }}>
                Catalog Category Classifications
              </label>
              
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name..."
                  className="form-input"
                  style={{ flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="btn btn-primary"
                  style={{ padding: "0 1.5rem", height: "38px" }}
                >
                  Add
                </button>
              </div>

              {/* Tag Pill Grid */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  backgroundColor: "hsl(var(--bg-secondary))",
                  padding: "12px",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      backgroundColor: "hsl(var(--bg-card))",
                      border: "1.5px solid hsl(var(--text-primary))",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "hsl(var(--text-primary))",
                    }}
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "hsl(var(--text-muted))",
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        lineHeight: 1,
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color 0.15s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "hsl(var(--danger))")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "hsl(var(--text-muted))")}
                    >
                      &times;
                    </button>
                  </div>
                ))}

                {categories.length === 0 && (
                  <span style={{ fontSize: "0.85rem", color: "hsl(var(--text-muted))", fontStyle: "italic" }}>
                    No categories have been registered.
                  </span>
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: "1rem" }}
            >
              Save Configuration Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
