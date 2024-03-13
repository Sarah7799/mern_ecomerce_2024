import axios from "axios";
import Layout from "./../components/Layout/Layout.js";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart.js";
const CategoryProduct = () => {
  const params = useParams();
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    if (params?.slug) getProductByCat();
  }, [params?.slug]);

  const getProductByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProduct(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="container">
        <h3 className="text-center mt-3">Category : {category?.name}</h3>
        <div className="d-flex flex-wrap">
          {product?.map((p) => (
            <div className="card m-2" key={p.id} style={{ width: "17rem" }}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body ">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
                <p className="card-text">₹ {p.price}</p>
                <button
                  className="btn btn-primary ms-1"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </button>
                <button
                  className="btn btn-warning ms-1"
                  onClick={() => {
                    setCart([...cart, p]);
                    toast.success("Items added to cart");
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
