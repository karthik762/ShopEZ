import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user")
      );
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const user = getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/api/cart/${user._id}`
      );

      if (!res.data) {
        setCart({ products: [] });
      } else {
        setCart(res.data);
      }

    } catch (error) {
      console.log(error);
      setCart({ products: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    const user = getUser();

    if (!user) return;

    try {
      await axios.post(
        `${API_URL}/api/cart/add`,
        {
          userId: user._id,
          productId,
          quantity: 1,
        }
      );

      fetchCart();

      window.dispatchEvent(
        new Event("auth-change")
      );

    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (
    productId
  ) => {
    const user = getUser();

    if (!user) return;

    try {
      await axios.delete(
        `${API_URL}/api/cart/remove`,
        {
          data: {
            userId: user._id,
            productId,
          },
        }
      );

      fetchCart();

      window.dispatchEvent(
        new Event("auth-change")
      );

    } catch (error) {
      console.log(error);
    }
  };

  const getTotal = () => {
    if (!cart?.products) return 0;

    return cart.products.reduce(
      (sum, item) => {
        if (!item.productId)
          return sum;

        return (
          sum +
          item.productId.price *
            item.quantity
        );
      },
      0
    );
  };

  if (loading) {
    return (
      <p style={{ padding: "20px" }}>
        Loading cart...
      </p>
    );
  }

  const user = getUser();

  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <p>
          Please login to view your
          cart.
        </p>
      </div>
    );
  }

  

  if (user.usertype === "Admin") {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>
          Admin accounts do not use
          carts.
        </h2>

        <p>
          Please use the Admin
          Dashboard to manage
          products and orders.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--heading)", fontSize: "42px", color: "var(--text-h)", marginBottom: "30px", textAlign: "left" }}>
        Shopping Cart
      </h1>

      {!cart?.products ||
      cart.products.filter(
        (item) => item.productId
      ).length === 0 ? (
        <p style={{ color: "var(--text)", fontStyle: "italic", textAlign: "left" }}>Your cart is empty.</p>
      ) : (
        <>
          {cart.products
            .filter(
              (item) =>
                item.productId
            )
            .map((item) => (
              <div
                key={item._id}
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card-bg)",
                  marginBottom: "16px",
                  padding: "20px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "var(--shadow)",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontFamily: "var(--heading)",
                      fontSize: "20px",
                      color: "var(--text-h)",
                    }}
                  >
                    {item.productId.name}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "var(--text)",
                      fontSize: "14px",
                      opacity: 0.8,
                    }}
                  >
                    ₹{item.productId.price} each
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <button
                    onClick={() => removeFromCart(item.productId._id)}
                    style={{
                      width: "30px",
                      height: "30px",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                  >
                    −
                  </button>

                  <span
                    style={{
                      fontWeight: "600",
                      minWidth: "20px",
                      textAlign: "center",
                      color: "var(--text-h)",
                    }}
                  >
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => addToCart(item.productId._id)}
                    style={{
                      width: "30px",
                      height: "30px",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                  >
                    +
                  </button>

                  <span
                    style={{
                      marginLeft: "15px",
                      fontFamily: "var(--heading)",
                      color: "var(--accent)",
                      fontWeight: "600",
                      fontSize: "18px",
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    ₹{item.productId.price * item.quantity}
                  </span>
                </div>
              </div>
            ))}

          <div
            style={{
              marginTop: "30px",
              borderTop: "2px solid var(--border)",
              paddingTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                fontFamily: "var(--heading)",
                fontWeight: "600",
                color: "var(--text-h)",
              }}
            >
              Total: <span style={{ color: "var(--accent)" }}>₹{getTotal()}</span>
            </span>

            <Link to="/checkout">
              <button
                style={{
                  padding: "12px 30px",
                }}
              >
                Proceed to Checkout →
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;