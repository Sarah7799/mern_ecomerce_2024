import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
const Orders = () => {
  const [orders, setOrders] = useState();
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);
  return (
    <Layout title={"User-Orders"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders?.map((o, i) => {
              return (
                <div className="border shadow">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Products Ordered</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>{i + 1}</th>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td className="text-center">{o?.products?.length}</td>
                        <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                        <td>{o?.payment?.transaction?.amount}</td>
                        <td>{moment(o?.createdAt).calendar()}</td>
                      </tr>
                    </tbody>
                  </table>

                  {o.products.map((p) => (
                    <div className="row mb-2 flex-row" key={p._id}>
                      <div className="col-md-3">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          width="100px"
                          height={"75px"}
                        />
                      </div>
                      <div className="col-md-5 text-center">
                        <h6>{p.name}</h6>
                        <p>{p.description.substring(0, 30)}</p>
                      </div>

                      <div className="col-md-4 ">
                        <p> ₹ {p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
