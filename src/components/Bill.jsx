import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./styles/bill.css";
import axios from "axios";
import ReviewProduct from "../pages/ReviewProduct";
import { RotatingLines } from "react-loader-spinner";

const Bill = () => {
  const { bill_id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState(1);
  const [amountKIP, setAmountKIP] = useState(1);
  const [bill, setBill] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [product_id, setProductId] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [condition, setCondition] = useState(false);
  const [toCurrency, setToCurrency] = useState("KRW");
  const [toCurrencyKIP, setToCurrencyKIP] = useState("LAK");

  const [exchangeRate, setExchangeRate] = useState(1);
  const [exchangeRates, setExchangeRates] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const currenciesKRW = 0;
  const currenciesKIP = 0;

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );
      const data = await response.json();
      setExchangeRates({
        USD: 1,
        KRW: data.rates.KRW,
        KIP: data.rates.LAK,
      });
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API + `/store/order/${bill_id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setBill(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchOrderDetails();
  }, [bill_id]);

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
      if (fromCurrency !== toCurrency) {
        try {
          const response = await fetch(
            `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
          );
          const data = await response.json();
          setExchangeRate(data.rates[toCurrency] + currenciesKRW);
        } catch (error) {
          console.error("Error fetching the exchange rate:", error);
        }
      }
    };

    getExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const getExchangeRates = async () => {
      if (fromCurrency !== toCurrencyKIP) {
        try {
          const response = await fetch(
            `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
          );
          const data = await response.json();
          setExchangeRates(data.rates[toCurrencyKIP] + currenciesKIP);
        } catch (error) {
          console.error("Error fetching the exchange rate:", error);
        }
      }
    };

    getExchangeRates();
  }, [fromCurrency, toCurrencyKIP]);

  const convertCurrency = () => {
    return (amount * exchangeRate).toFixed(2);
  };
  const convertCurrencyKIP = () => {
    return (amountKIP * exchangeRates).toFixed(2);
  };
  ///////////////////

  const formatPrice = (price, currency) => {
    if (currency === "USD") {
      return Number(price).toFixed(2);
    } else {
      const convertedPrice = price * exchangeRates[currency];
      return Math.round(convertedPrice).toLocaleString();
    }
  };

  const handleReview = (id) => {
    setProductId(id);
    setShowReview(true);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_API + "/store/review/create",
        JSON.stringify({
          product: product_id,
          user: localStorage.getItem("user_id"),
          rating,
          comment,
        }),
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Review submitted:", response.data);
      alert("Your review has been successfully submitted.");
      setRating(0);
      setComment("");
      setShowReview(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  // Delivery fee
  var totalPrice = 0;
  if (!condition) {
    totalPrice = 3;
  }

  const total = bill && bill.total_prices ? parseInt(bill.total_prices) + totalPrice : totalPrice;

  if (!bill) {
    return (
      <div className="loading">
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
    );
  }

  return (
    <>
      {showReview ? (
        <ReviewProduct
          id={product_id}
          rating={rating}
          onRatingChange={handleRatingChange}
          comment={comment}
          onCommentChange={handleCommentChange}
          onSubmitReview={handleSubmitReview}
        />
      ) : (
        <>
          <div className="bill">
            <Header />
            <div className="billContainer">
              <div className="additionalInfo">
                <span>주문 ID: {bill_id}</span>
                <span>
                  날짜 시간: {new Date(bill.created_at).toLocaleString()}
                </span>
              </div>
              <table className="billTable">
                <thead>
                  <tr>
                    <th>제품명</th>
                    <th>가격</th>
                    <th>양</th>
                    {bill.status === "Delivered" && (
                      <th className="Header_review">리뷰</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product.name}</td>
                      <td>{item.product.price}</td>
                      <td>{item.quantity}</td>
                      {bill.status === "Delivered" && (
                        <td className="Header_review">
                          <button
                            className="Delivered_review"
                            onClick={() => handleReview(item.product.id)}
                          >
                            리뷰
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="additionalInfo">
                <div>시간: {bill.province}</div>
                <div>배송비: 3$가 이미 총 가격에 포함되어 있습니다.</div>

                <div className="total">
                  {bill.shipping_company === "KRW" && (
                    <div className="titlePrice">
                      <h4>합계 KRW :</h4>
                      <div className="container_total"> ₩
                      {(() => {
                        const convertedTotal = total * convertCurrency();
                        console.log('KRW Total:', convertedTotal);
                        return isNaN(convertedTotal) ? "0" : convertedTotal.toLocaleString();
                      })()}
                      </div>
                    </div>
                  )}
                  {bill.shipping_company === "KIP" && (
                    <div className="titlePrice">
                      <h4>합계 KIP :</h4>
                      <div className="container_total">
                        {(() => {
                          const convertedTotal = total * convertCurrencyKIP();
                          return isNaN(convertedTotal) ? "0" : convertedTotal.toLocaleString();
                        })()} KIP
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="paymentInfo">
                <div>결제수단: {bill.account_name}</div>
                <div>연락처: {bill.tel}</div>
                <div>배송 주소: {bill.district}</div>
                <div>
                  상태:{" "}
                  <span className={bill.status.toLowerCase()}>
                    {bill.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Bill;
