import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "./../styles/CartStyles.css";

const Checkout = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");

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
      navigate("/dashboard/user/orders");
      toast.success("Payment completeed successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Layout title={"Checkout"}>
      <div className="container bg-white">
        <div className="row m-3">
          <div className="col-md-6 mt-2">
            <h3>Billing Details</h3>
            <div className="mt-4 card p-4">
              <form>
                <div className="d-flex flex-row ">
                  <div className="mb-3">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-control"
                      id="exampleInputName"
                      placeholder="Enter your First Name"
                      required
                    />
                  </div>
                  <div className="mb-3  " style={{ marginLeft: "20px" }}>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-control "
                      placeholder="Enter your Last Name"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter the Email Id"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    id="exampleInputAddess"
                    placeholder="Address"
                    required
                  />
                </div>
                <div className="d-flex flex-row">
                  <div className="mb-3">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-control"
                      id="exampleInputCity"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="mb-3" style={{ marginLeft: "10px" }}>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="form-control"
                      id="exampleInputPin"
                      placeholder="State"
                      required
                    />
                  </div>

                  <div className="mb-3" style={{ marginLeft: "10px" }}>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="form-control"
                      id="exampleInputPin"
                      placeholder="PIN"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    id="exampleInputPhone"
                    placeholder="Phone"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="form-control"
                    id="exampleInputCountry"
                    placeholder="Country"
                    required
                  />
                </div>
              </form>
            </div>

            <div className="mt-5">
              {!clientToken || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading || !instance}
                  >
                    {loading ? "Processing...." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <h3 className="text-center ">YOUR ORDER</h3>
            <div className="row box-shadow">
              <div className="col-md-8 text-center">
                <h6>Products</h6>
              </div>
              <div className="col-md-4 text-center">
                <h6>Price</h6>
              </div>
              <hr />
            </div>
            <div>
              {cart.map((p) => (
                <div className="row mb-3 flex-row p-3 ">
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                  </div>
                  <div className="col-md-6">
                    <h6>{p.name}</h6>
                    <p>{p.description.substring(0, 30)}</p>
                  </div>
                  <div className="col-md-2 p-2">
                    <p> ₹ {p.quantity * p.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="row flex-row p-3">
                <div className="col-md-10 ">
                  <h6>Subtotal</h6>
                </div>
                <div className="col-md-2 ">
                  <h6>₹ {totalPrice()} </h6>
                </div>
              </div>
            </div>

            <div>
              <div className="row flex-row p-3">
                <div className="col-md-8 ">
                  <h6>Shipping </h6>
                </div>
                <div className="col-md-4 ">
                  <p>Enter your address to view shipping options.</p>
                </div>
              </div>
            </div>

            <div>
              <div className="row flex-row p-3">
                <div className="col-md-10 ">
                  <h6>Total</h6>
                </div>
                <div className="col-md-2 ">
                  <h6>₹ {totalPrice()} </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
