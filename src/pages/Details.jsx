import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/details.css";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate, useParams } from "react-router-dom";

const Details = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { hotelName, room_number, address, id, category } = useParams();
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );
  const MySwal = withReactContent(Swal);
  const [productsList, setProductsList] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const navigate = useNavigate();
  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(Math.max(1, quantity - 1));

  const [showPopup, setShowPopup] = useState(false);
  // Function to check if the current time is within the specified range (11 PM - 1:30 AM)
  const checkTime = () => {
    const now = new Date();
    const startTime = new Date();
    const endTime = new Date();

    startTime.setHours(1, 30, 0);
    endTime.setHours(11, 0, 0);

    // Adjust for end time past midnight
    if (now >= startTime && now < endTime) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    checkTime();
    const intervalId = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);

    useEffect(() => {
    if (showPopup) {
      MySwal.fire({
        text: "장바구니 추가는 현재 비활성화되어 있습니다.",
        icon: "info",
      }).then(() => {
        setShowPopup(true);
      });
    }
  }, [showPopup]);

  // console.log("productproduct....", product)

  ////////////// Product_Detail ////////////////
  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API}/store/detail/${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  //////////// Add to Cart ///////////
  const addToCart = () => {
    if (!token) {
      MySwal.fire({
        text: "먼저 로그인하거나 QR 코드를 스캔하세요",
        icon: "info",
      });
      return;
    }

    const existingProduct = cart.find(
      (item) => item.id === product.id && item.store_name === product.store_name
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.store_name === product.store_name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    MySwal.fire({
      text: "이 제품이 장바구니에 추가되었습니다.",
      icon: "success",
    });
  };

  //////////// Checkout ///////////
  const handleCheckout = () => {
    if (!token) {
      MySwal.fire({
        text: "먼저 로그인하거나 QR 코드를 스캔하세요",
        icon: "info",
      });
      return;
    }

    const orderData = {
      user: user.user_id,
      store: product.store_id,
      items: [
        {
          id: product.id,
          name: product.name,
          images: product.images,
          quantity,
          price: product.price,
        },
      ],
    };

    // ใช้ navigate เพื่อไปยังหน้า Checkout พร้อมส่งข้อมูล
    navigate("/checkout", { state: { order: orderData } });
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // console.log("cart......", cart)

  ///////////// ProductsList ///////////////
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/store/?category=${category}`)
      .then((response) => setProductsList(response.data))
      .catch((error) => console.error("Error fetching products list:", error));
  }, [category]);

  /////////// StarAVG ////////////
  const StarAVG = (value) => (value / 5) * 100 || 100;

  ////////////// Review /////////////
  useEffect(() => {
    setDisplayedReviews(showAllReviews ? reviews : reviews.slice(0, 3));
  }, [reviews, showAllReviews]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/store/product/${id}/review`)
      .then((response) => {
        const sortedReviews = response.data.sort((a, b) => b.id - a.id);
        setReviews(sortedReviews);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [id]);

  useEffect(() => {
    setDisplayedReviews(showAllReviews ? reviews : reviews.slice(0, 3));
  }, [reviews, showAllReviews]);

  const handleToggleReviews = () => setShowAllReviews((prev) => !prev);

  return (
    <>
      <div className="details-container">
        <Header />
        <div className="product-details">
          <img src={product.images} alt="꼬치" className="product-image" />
          <div className="product-info">
            <h1>제품명: {product?.name}</h1>
            <div className="price">
              가격: <div className="txt_price">${product.price}</div>
            </div>
            <div className="stock">남은 수량: {product.quantity}</div>
            <div className="description">설명: {product.description}</div>
            <div className="quantity-selector">
              <button onClick={handleDecrement}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrement}>+</button>
            </div>
            <div className="action-buttons">
              <button className="buy-now" onClick={handleCheckout} disabled={showPopup}>
                지금 구매
              </button>
              <button
                className="echbtn btnAdd"
                onClick={addToCart}
                disabled={showPopup}
              >
                장바구니에 추가
              </button>
            </div>
          </div>
        </div>

        <div className="reviews">
          <h2>모든 리뷰</h2>
          {displayedReviews.length === 0 ? (
            <div>이용 가능한 리뷰가 없습니다.</div>
          ) : (
            <ul>
              {displayedReviews.map((review) => (
                <li key={review.id}>
                  <h1>{review.user.nickname || "null"}:</h1>
                  <div>{review.comment || "null"}</div>
                </li>
              ))}
            </ul>
          )}
          {reviews.length > 3 && (
            <button
              className="toggle-reviews-button"
              onClick={handleToggleReviews}
            >
              {showAllReviews ? "간략히 표시" : "더보기"}
            </button>
          )}
        </div>

        <div className="related-products">
          <h4 className="txt_header_product">더 많은 제품</h4>
          <div className="product-grid">
            {productsList.map((product, index) => (
              <div className="product-card" key={index}>
                <Link
                  to={
                    hotelName && room_number && address
                      ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/details/${product.id}`
                      : `/details/${product.id}`
                  }
                >
                  <img src={product.images} alt="image" />
                  <div className="star-rating">
                    <div className="stars-outer">
                      <div
                        className="stars-inner"
                        style={{ width: `${StarAVG(product.star_avg)}%` }}
                      ></div>
                    </div>
                  </div>
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-price">${product.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Details;
