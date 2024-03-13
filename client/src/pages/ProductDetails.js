import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import "../styles/ProductDetailsStyles.css";
import { FaCartPlus } from "react-icons/fa6";
import { ListGroupItem, Form, Row, Col } from "react-bootstrap";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useCart();

  const navigate = useNavigate();
  //initial product details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  //get product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  //similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={product.name}>
      <div className="row container product-details">
        <div className="col-md-6 ">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height={"350px"}
            width="350px"
          />
        </div>
        <div className="col-md-6 text-center mt-3 product-details-info  ">
          <h4> {product.name}</h4>
          <h6> ₹ {product.price}</h6>
          <h6>Inclusive of all taxes</h6>
          <p>
            Ships from : <b> Sarah Trendy Trove</b>
          </p>

          <h6>Sold by :</h6>
          <p>Description : {product.description}</p>

          <h6>{product.quantity > 0 ? "InStock" : "Out of Stock"} </h6>
          <p>Category : {product?.category?.name}</p>
          {/* <p>Estimated Delivery : </p> */}
          {/* <p>Product Id :{product._id}</p> */}
          {product.quantity > 0 && (
            <ListGroupItem>
              <Row className="row-quantity">
                <Col md={3}></Col>
                <Col md={3}>
                  <Form.Select
                    as="select"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    size="sm"
                  >
                    {[...Array(product.quantity).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setCart([...cart, product]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, product])
                      );
                      toast.success("Items added to cart");
                    }}
                  >
                    Add to Cart <FaCartPlus />
                  </button>
                </Col>
              </Row>
            </ListGroupItem>
          )}
        </div>
      </div>
      <hr />

      <div className="row m-2 similar-products">
        <h6>Similar Products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p.id} style={{ width: "20rem" }}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
                height={"100px"}
              />
              <div className="card-body ">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">₹ {p.price}</h5>
                </div>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
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
                    localStorage.setItem("cart", JSON.stringify([...cart, p]));
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

export default ProductDetails;
