import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/cart.css";
import { AiOutlineDelete } from "react-icons/ai";
import { Link , useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const Cart = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);

  const { hotelName, room_number, address, category } = useParams();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // console.log("cartcartcart....", cart)

  //////////////// API Price //////////////////////

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [toCurrencyKIP, setToCurrencyKIP] = useState("LAK");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [exchangeRates, setExchangeRates] = useState(1);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    // Fetch the list of currencies and exchange rates from an API
    const getCurrencies = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        const uniqueCurrencies = Array.from(
          new Set([data.base, ...Object.keys(data.rates)])
        );
        setCurrencies(uniqueCurrencies);
        setExchangeRate(data.rates[toCurrency]);
        setExchangeRates(data.rates[toCurrencyKIP]);
      } catch (error) {
        console.error("Error fetching the currencies:", error);
      }
    };

    getCurrencies();
  }, []);

  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        const data = await response.json();
        setExchangeRate(data.rates[toCurrency]);
        setExchangeRates(data.rates[toCurrencyKIP]);
      } catch (error) {
        console.error("Error fetching the exchange rate:", error);
      }
    };

    getExchangeRate();
  }, [fromCurrency, toCurrency, toCurrencyKIP]);

  const totalPriceUSD = getTotalPrice();
  const totalPriceKRW = (totalPriceUSD * exchangeRate).toFixed(2);
  const totalPriceKIP = (totalPriceUSD * exchangeRates).toFixed(2);

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }

  const removeFromCart = (id, store_name, color, size, description) => {
    setCart(
      cart.filter(
        (item) =>
          !(
            item.id === id &&
            item.store_name === store_name &&
            item.color === color &&
            item.description === description &&
            item.size === size
          )
      )
    );
  };

  const updateQuantity = (id, store_name, color, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, store_name, color, size);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id &&
          item.store_name === store_name &&
          item.color === color &&
          item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const handleCheckout = () => {
    const checkoutData = {
      order: {
        items: cart,
        totalUSD: totalPriceUSD,
        totalKRW: totalPriceKRW,
        totalKIP: totalPriceKIP,
      }
    };
   
    if (hotelName && room_number && address) {
      // กรณีมีข้อมูลโรงแรม
      navigate(`/hotel/${hotelName}/room_number/${room_number}/address/${address}/checkout`, {
        state: checkoutData,
        replace: true,
      });
    } else {
      // กรณีไม่มีข้อมูลโรงแรม
      navigate("/checkout", {
        state: checkoutData,
        replace: true,
      });
    }

    localStorage.removeItem('cart');
    setCart([]);
  };

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

  ///////////// ProductsList ///////////////
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/store/?category=${category}`)
      .then((response) => setProductsList(response.data))
      .catch((error) => console.error("Error fetching products list:", error));
  }, [category]);

    /////////// StarAVG ////////////
    function StarAVG(value) {
      let star_avg = (value / 5) * 100;
      if (star_avg === 0) {
        star_avg = 100;
      }
      return star_avg;
    }

  return (
    <>
      <div className="cart-container">
        <Header />

        {cart.length === 0 ? (
          <p className="no-reviews-message">장바구니가 비어 있습니다.</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div className="product-carts" key={index}>
                <img src={item.images} alt="김밥" className="product-image" />
                <div className="product-info">
                  <h2 className="product-name">제품명: {item.name}</h2>
                  <div className="product-price">가격: ${item.price}</div>
                  <div className="product-description">
                    설명: {item.description}
                  </div>

                  <div className="quantity_AiOutlineDelete">
                    <div className="quantity-control">
                      <button
                        className="quantity-button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.store_name,
                            item.color,
                            item.size,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.store_name,
                            item.color,
                            item.size,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="btnicon_delete_order">
                      <AiOutlineDelete
                        id="btnicon_delete"
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.store_name,
                            item.color,
                            item.size,
                            item.description
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {cart.length > 0 && (
          <div className="cart-summary">
            <h4 className="summary-title">장바구니 합계</h4>
            <div>
              수량:{" "}
              <span className="summary-value">
                {cart.reduce((total, item) => total + item.quantity, 0)} 품목
              </span>
            </div>
            <div>
              합계 USD:{" "}
              <span className="summary-value">${totalPriceUSD.toFixed(2)}</span>
            </div>
            <div>
              합계 KRW: <span className="summary-value">₩ {totalPriceKRW}</span>
            </div>
            <div>
              합계 KIP:{" "}
              <span className="summary-value">{totalPriceKIP} KIP</span>
            </div>
            <button
              className="checkout-button"
              onClick={handleCheckout}
            >
              확인하다
            </button>
          </div>
        )}

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
                      <div className="stars-inner"
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

export default Cart;
