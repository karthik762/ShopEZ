import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import { useToast } from "../components/Toast";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/settings");
      if (res.data && res.data.categories) {
        setCategories(res.data.categories);
        if (res.data.categories.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: prev.category || res.data.categories[0],
          }));
        }
      }
    } catch (error) {
      console.log("Failed to load categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      showToast("Please fill in Name, Price, and Stock", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("Product successfully added!", "success");

      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: categories[0] || "",
        stock: "",
      });

      fetchProducts();
    } catch (error) {
      console.log(error);
      showToast("Failed to add product.", "error");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("Product deleted successfully.", "success");
      fetchProducts();
    } catch (error) {
      console.log(error);
      showToast("Failed to delete product.", "error");
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setEditData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveProduct = async () => {
    if (!editData.name || !editData.price || !editData.stock) {
      showToast("Required fields cannot be empty", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/products/${editingId}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("Product updated successfully!", "success");
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.log(error);
      showToast("Failed to update product.", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--bg-primary))" }}>
      <AdminHeader />

      <div className="container" style={{ maxWidth: "1100px", paddingBottom: "6rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-display)", textTransform: "uppercase", margin: 0 }}>
            Inventory Management
          </h1>
          <p style={{ color: "hsl(var(--text-secondary))", margin: "6px 0 0", fontSize: "0.95rem" }}>
            Add new products or modify existing stock listings.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Left Column: Form Card */}
          <div
            style={{
              border: "1.5px solid hsl(var(--text-primary))",
              backgroundColor: "hsl(var(--bg-card))",
              padding: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
                borderBottom: "1px solid hsl(var(--border))",
                paddingBottom: "0.5rem",
              }}
            >
              {editingId ? "Edit Product Details" : "Create New Product"}
            </h3>

            {editingId ? (
              // EDIT FORM
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    className="form-input"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Enter product description"
                    style={{ minHeight: "80px", resize: "vertical", lineHeight: "1.4" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    className="form-input"
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-input"
                    value={editData.image}
                    onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    style={{ cursor: "pointer" }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Units *</label>
                  <input
                    className="form-input"
                    type="number"
                    value={editData.stock}
                    onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveProduct}>
                    Save updates
                  </button>
                  <button className="btn btn-secondary" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // ADD FORM
              <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    className="form-input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    style={{ minHeight: "80px", resize: "vertical", lineHeight: "1.4" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    className="form-input"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-input"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{ cursor: "pointer" }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Units *</label>
                  <input
                    className="form-input"
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: "10px" }}>
                  Add Product
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Inventory List */}
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              Active Catalog ({products.length})
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {products.map((product) => {
                const stockVal = Number(product.stock);
                const isOutOfStock = stockVal === 0;
                const isLowStock = stockVal > 0 && stockVal < 5;

                return (
                  <div
                    key={product._id}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      padding: "1rem",
                      alignItems: "center",
                      border: "1.5px solid hsl(var(--text-primary))",
                      backgroundColor: "hsl(var(--bg-card))",
                      opacity: editingId && editingId !== product._id ? 0.6 : 1,
                    }}
                  >
                    {/* Thumbnail Image */}
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "hsl(var(--bg-secondary))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        border: "1px solid hsl(var(--border))",
                        flexShrink: 0,
                      }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 800,
                            fontFamily: "var(--font-display)",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.name}
                        </h4>
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                          <button
                            onClick={() => editProduct(product)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "6px" }}
                            title="Edit"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "6px", color: "hsl(var(--danger))" }}
                            title="Delete"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "hsl(var(--text-secondary))",
                          margin: "4px 0",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.description || "No description provided."}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                        <span style={{ fontSize: "1rem", fontWeight: 700, color: "hsl(var(--text-primary))" }}>
                          ₹{Number(product.price).toLocaleString("en-IN")}.00
                        </span>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--text-secondary))" }}>
                            Qty: {product.stock}
                          </span>
                          {isOutOfStock ? (
                            <span
                              style={{
                                border: "1px solid hsl(var(--danger))",
                                color: "hsl(var(--danger))",
                                padding: "1px 6px",
                                fontSize: "0.6rem",
                                fontWeight: 700,
                              }}
                            >
                              [ OUT OF STOCK ]
                            </span>
                          ) : isLowStock ? (
                            <span
                              style={{
                                border: "1px solid hsl(var(--accent))",
                                color: "hsl(var(--accent))",
                                padding: "1px 6px",
                                fontSize: "0.6rem",
                                fontWeight: 700,
                              }}
                            >
                              [ LOW STOCK ]
                            </span>
                          ) : (
                            <span
                              style={{
                                border: "1px solid hsl(var(--success))",
                                color: "hsl(var(--success))",
                                padding: "1px 6px",
                                fontSize: "0.6rem",
                                fontWeight: 700,
                              }}
                            >
                              [ IN STOCK ]
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;