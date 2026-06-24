import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function AdminProducts() {
  const [products, setProducts] = useState([]);

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
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/products`
      );

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

    try {
      const token = localStorage.getItem("token");

      const formattedCategory = typeof formData.category === 'string'
        ? formData.category.split(",").map(c => c.trim()).filter(Boolean)
        : formData.category;

      await axios.post(
        `${API_URL}/api/products`,
        { ...formData, category: formattedCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.showToast("Product Added successfully!", "success");

      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: "",
      });

      fetchProducts();
    } catch (error) {
      console.log(error);
      window.showToast("Failed to Add Product", "error");
    }
  };

  const deleteProduct = async (id) => {

    if ( !window.confirm(
    "Are you sure you want to delete this product?"
  )
)
  return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.showToast("Product Deleted successfully!", "success");

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);

    setEditData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: Array.isArray(product.category) ? product.category.join(", ") : product.category,
      stock: product.stock,
    });
  };

  const saveProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      const formattedCategory = typeof editData.category === 'string'
        ? editData.category.split(",").map(c => c.trim()).filter(Boolean)
        : editData.category;

      await axios.put(
        `${API_URL}/api/products/${editingId}`,
        { ...editData, category: formattedCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.showToast("Product Updated successfully!", "success");

      setEditingId(null);

      fetchProducts();
    } catch (error) {
      console.log(error);
      window.showToast("Update Failed", "error");
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
      <h1 style={{ fontFamily: "var(--heading)", fontSize: "42px", color: "var(--text-h)", marginBottom: "35px" }}>
        Manage Products
      </h1>

      <form
        onSubmit={handleAddProduct}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "30px",
          boxShadow: "var(--shadow)",
          marginBottom: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h3 style={{ fontFamily: "var(--heading)", fontSize: "22px", color: "var(--accent)", margin: "0 0 10px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
          Add New Product
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />

          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ width: "100%", boxSizing: "border-box" }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <input
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />

          <input
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          style={{ width: "100%", boxSizing: "border-box" }}
        />

        <button type="submit" style={{ padding: "12px", width: "200px", alignSelf: "flex-start", marginTop: "10px" }}>
          Add Product
        </button>
      </form>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "40px 0" }} />

      <h2 style={{ fontFamily: "var(--heading)", fontSize: "32px", color: "var(--text-h)", marginBottom: "24px" }}>
        All Products
      </h2>

      {products.map((product) => (
        <div
          key={product._id}
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border)",
            padding: "24px",
            marginBottom: "20px",
            borderRadius: "8px",
            boxShadow: "var(--shadow)",
            display: "flex",
            gap: "24px",
            alignItems: "center",
          }}
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "4px",
                border: "1px solid var(--border)",
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            {editingId === product._id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
                <input
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <input
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    placeholder="Price"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                  <input
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    placeholder="Category"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                  <input
                    value={editData.stock}
                    onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
                    placeholder="Stock"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>
                <button onClick={saveProduct} style={{ padding: "10px 20px", width: "160px", marginTop: "5px" }}>
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ margin: "0 0 6px", fontFamily: "var(--heading)", fontSize: "22px", color: "var(--text-h)" }}>
                  {product.name}
                </h3>

                <p style={{ margin: "0 0 10px", color: "var(--text)", fontSize: "14px", opacity: 0.8 }}>
                  {product.description}
                </p>

                <div style={{ display: "flex", gap: "20px", marginBottom: "12px", fontSize: "13px", color: "var(--stone-taupe)" }}>
                  <span>
                    <strong>Category:</strong> {Array.isArray(product.category) ? product.category.join(", ") : product.category}
                  </span>
                  <span>
                    <strong>Stock:</strong> {product.stock}
                  </span>
                </div>

                {product.stock === 0 ? (
                  <p style={{ color: "#E28B8B", fontSize: "13px", fontWeight: "600", margin: "0 0 12px" }}>
                    ❌ Out of Stock
                  </p>
                ) : product.stock < 5 ? (
                  <p style={{ color: "var(--olive-gold)", fontSize: "13px", fontWeight: "600", margin: "0 0 12px" }}>
                    ⚠ Low Stock
                  </p>
                ) : null}

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <h3 style={{ margin: 0, color: "var(--accent)", fontSize: "20px", fontFamily: "var(--heading)" }}>
                    ₹{product.price}
                  </h3>
                  <div>
                    <button
                      onClick={() => editProduct(product)}
                      style={{ padding: "8px 18px", fontSize: "12px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      style={{
                        marginLeft: "10px",
                        padding: "8px 18px",
                        fontSize: "12px",
                        backgroundColor: "transparent",
                        color: "var(--text-h)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminProducts;