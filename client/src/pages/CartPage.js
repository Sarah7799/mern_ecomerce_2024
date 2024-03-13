import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  //total price
  const totalPrice = (pid) => {
    try {
      let myCart = [...cart];
      return myCart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    } catch (error) {
      console.log(error);
    }
  };
  //subTotalPrice
  const subTotalPrice = (pid) => {
    try {
      let myCart = [...cart];
      let subtotal = 0;
      myCart.map((item) =>
        item._id === pid ? (subtotal = item.quantity * item.price) : item
      );
      return subtotal;
    } catch (error) {
      console.log(error);
    }
  };

  // delete cart Item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //Decrement of cart item
  const handleDecrement = (pid) => {
    try {
      setCart((cart) =>
        cart.map((item) =>
          pid === item._id
            ? { ...item, quantity: item.quantity - (item.quantity > 1 ? 1 : 0) }
            : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  //Increment of cart item
  const handleIncrement = (pid) => {
    try {
      setCart((cart) =>
        cart.map((item) =>
          pid === item._id
            ? {
                ...item,
                quantity: item.quantity + (item.quantity < 10 ? 1 : 0),
              }
            : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/cart/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //Make Payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/cart/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/order");
      toast.success("Payment completed successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout title={"Shopping Cart"}>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="row product-details">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="row mb-3 card flex-row p-3 ">
                <div className="col-md-4">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                </div>
                <div className="col-md-6">
                  <h6>{p.name}</h6>
                  <p>{p.description}</p>
                  <h6>InStock</h6>
                  <div className="p-3">
                    <button
                      className="btn btn-danger mt-5"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="col-md-2">
                  <h6>{p.price}</h6>
                  <h6>{p.price * p.quantity}</h6>
                  <div className="order-quantity mt-4 text-center">
                    <button
                      className="minus"
                      onClick={() => handleDecrement(p._id)}
                    >
                      -
                    </button>
                    <h6 className="one">{p.quantity}</h6>
                    <button
                      className="plus"
                      onClick={() => handleIncrement(p._id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <div className="row card ml-2 order-summary">
              <h4 className="mt-3">Order Summary</h4>
              <div className="row">
                <div className="col-md-3">
                  <p>Subtotal</p>
                </div>
                <div className="col-md-5"></div>
                <div className="col-md-4">₹ {totalPrice()}</div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <p>Estimated Shipping</p>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-4">₹ 0.00</div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p>Shopping Discount</p>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-4">₹ 0.00</div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <h5>Subtotal</h5>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <h5>₹ {totalPrice()}</h5>
                </div>
              </div>
              <button
                className="btn btn-primary checkout"
                onClick={() => navigate("/checkout")}
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 "></div>
          <div className="col-md-6 subtotal ">
            <h5>
              Subtotal({cart.length} items): {totalPrice()}
            </h5>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
