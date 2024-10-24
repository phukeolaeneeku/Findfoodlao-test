import React, { useState, useEffect } from "react";
import "./styles/order.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";

const Order = () => {
  // Local storage values
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const user_id = user.user_id || "";

  // Hooks for state management
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order_list, set_order_list] = useState([]);
  const [display_order, set_display_order] = useState([]);
  const [show_all_order, set_show_all_order] = useState(false);
  const [category, set_category] = useState(1);
  const [products_list, set_products_list] = useState([]);

  // Params from URL
  const { hotelName, room_number, address } = useParams();

  // Fetch product list based on category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/store/?category=${category}`,
          { headers: { "Content-Type": "application/json" } }
        );
        set_products_list(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [category]);

  /////////// StarAVG ////////////
  function StarAVG(value) {
    let star_avg = (value / 5) * 100;
    if (star_avg === 0) {
      star_avg = 100;
    }
    return star_avg;
  }

  // Token validation and navigation
  useEffect(() => {
    if (hotelName && room_number && address) return;

    const checkToken = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/user/check-token`,
          { token },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.result !== "success") {
          localStorage.clear();
          navigate("/login");
        }
      } catch (error) {
        localStorage.clear();
        navigate("/login");
      }
    };

    checkToken();
  }, [token, hotelName, room_number, address, navigate]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/store/user/${user_id}/order`,
          { headers: { "Content-Type": "application/json" } }
        );
        const sortedOrders = response.data.sort((a, b) => b.id - a.id);
        set_order_list(sortedOrders);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, [user_id]);

  // Handle display of orders
  useEffect(() => {
    set_display_order(show_all_order ? order_list : order_list.slice(0, 4));
  }, [order_list, show_all_order]);

  // Toggle show all orders
  const handleToggleOrders = () => {
    set_show_all_order((prev) => !prev);
  };

  return (
    <>
      <Header />
      <section id="container_order_item">
        <div className="container_order_all">
          <h2>주문</h2>

          {loading ? (
            <div className="box_Order_RotatingLines">
              <RotatingLines
                visible={true}
                height="45"
                width="45"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            </div>
          ) : display_order.length === 0 ? (
            <p className="no-reviews-message">지금은 주문이 없습니다</p>
          ) : (
            display_order.map((item) => (
              <Link
                to={
                  hotelName && room_number && address
                    ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/bill/${item.id}`
                    : `/bill/${item.id}`
                }
                key={item.id}
                className="box_item_order"
              >
                <div className="box_item_order_text">
                  <p className="OrderID">ID: {item.id}</p>
                  <p className=" box_text_ForPC ">
                    날짜 시간: {new Date(item.created_at).toLocaleString()}
                  </p>
                  <p className="order-status">상태: {item.status}</p>
                </div>
                <p className="box_text_ForMobile">
                  날짜 시간: {new Date(item.created_at).toLocaleString()}
                </p>
              </Link>
            ))
          )}
        </div>

        {order_list.length > 3 && (
          <div className="btn_show_more">
            <button
              className="toggle-reviews-button"
              onClick={handleToggleOrders}
            >
              {show_all_order ? "Show less" : "See more"}
            </button>
          </div>
        )}

        {display_order.length === 0 && (
          <>
            <div className="related-products">
              <h2>더 많은 제품</h2>
              <div className="product-grid">
                {products_list
                  .filter((product) => product.category !== "Food")
                  .map((i, index) => (
                    <div className="product-card" key={index}>
                      <Link
                        to={
                          hotelName && room_number && address
                            ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/details/${i.id}`
                            : `/details/${i.id}`
                        }
                      >
                        <img src={i.images} alt="image" />
                        <div className="star-rating">
                          <div className="stars-outer">
                            <div
                              className="stars-inner"
                              style={{ width: `${StarAVG(i.star_avg)}%` }}
                            ></div>
                          </div>
                        </div>
                        <h4 className="product-name">{i.name}</h4>
                        <p className="product-price">${i.price}</p>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Order;
