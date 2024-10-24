import React, { useState, useEffect, useRef } from "react";
import "./orderBill.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiPrinter } from "react-icons/fi";

const OrderBill = () => {
  const token = localStorage.getItem("token");
  const order_id = useParams().bill_id;
  const [order_list, setOrderList] = useState([]);
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [order_bill, set_order_bill] = useState(null);
  const MySwal = withReactContent(Swal);


  const [amount, setAmount] = useState(1);
  const [amountKIP, setAmountKIP] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [toCurrencyKIP, setToCurrencyKIP] = useState("LAK");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [exchangeRates, setExchangeRates] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const currenciesKRW = 0;
  const currenciesKIP = 0;

  const [menu_set, setMenu_set] = useState([]);
  const [condition, setCondition] = useState(false);

  useEffect(() => {
    if (order_list.items) {
      const menuSetValues = order_list.items.map((item) => item.color);
      setMenu_set(menuSetValues);
      if (menuSetValues.includes("set")) {
        setCondition(true);
      } else {
        setCondition(false);
      }
    }
  }, [order_list]);

  // Delivery fee
  var totalPrice = 0;
  if (!condition) {
    totalPrice = 3;
  }

  const total = parseInt(order_list.total_prices) + totalPrice;

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

  const goBack = () => {
    window.history.back();
  };
  const navigate = useNavigate();
  const printRef = useRef();
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  useEffect(() => {
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/check-token",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.result != "success") {
          localStorage.clear();
          navigate("/login");
          return;
        }
      })
      .catch((error) => {
        localStorage.clear();
        console.log(error);
        navigate("/login");
        return;
      });
  }, [token]);

  useEffect(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setOrderList(response.data);
        set_email(response.data.email);
        set_order_bill(response.data.order_bill);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [order_id, order_bill]);

  const ConfirmOrder = (e) => {
    e.preventDefault();

    let data = "";
    if (order_list.status == "Pending") {
      data = JSON.stringify({
        status: "Processing",
      });
    } else if (order_list.status == "Processing") {
      data = JSON.stringify({
        status: "Shipped",
      });
    } else if (order_list.status == "Shipped") {
      data = JSON.stringify({
        status: "Delivered",
      });
    } else if (order_list.status == "Delivered") {
      data = JSON.stringify({
        status: "Delivered",
      });
    } else {
      data = JSON.stringify({
        status: "Delivered",
      });
    }

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/update/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (order_list.status == "Pending") {
          MySwal.fire({
            text: "This order has been received.",
            icon: "success",
          });
          navigate("/order/processing");
        } else if (order_list.status == "Processing") {
          MySwal.fire({
            text: "This order has been processed",
            icon: "success",
          });
          navigate("/order/shipped");
        } else if (order_list.status == "Shipped") {
          MySwal.fire({
            text: "This order has been shipped.",
            icon: "success",
          });
          navigate("/order/delivered");
        } else if (order_list.status == "Delivered") {
          MySwal.fire({
            text: "This order has been delivered.",
            icon: "success",
          });
          navigate("/order/delivered");
        } else {
          MySwal.fire({
            text: "This order has been delivered.",
            icon: "success",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <AdminMenu />
      <section id="abill">
        <div className="abill-detial">
          <div className="container_Order_Bill">
            <button onClick={goBack} className="back_Order_Bill">
              <FaAngleLeft id="box_icon_Back" />
              <div>Back</div>
            </button>
            <div className="box_containner_FiPrinter">
              <FiPrinter id="FiPrinter" onClick={handlePrint} />
            </div>
          </div>

          <div ref={printRef}>
            <div className="guopoidHead">
              <div>주문 ID: {order_list.id}</div>
              <div>
                사용자: {name || email ? name || email : order_list.district}
              </div>
            </div>

            <div className="billGopBox">
              <div className="box_table">
                <div className="txtHeaders">
                  <div className="Header">제품명</div>
                  <div className="Header">가격</div>
                  <div className="Header">양</div>
                </div>

                {order_list.items &&
                  order_list.items.map((item) => (
                    <div className="txtHeader" key={item.id}>
                      <div className="txt_Des">{item.product.name}</div>
                      <div className="txt_Des">
                        $
                        {parseFloat(item.price).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                          useGrouping: true,
                        })}
                      </div>
                      <div className="txt_Des">{item.quantity}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="box_totleAdd_container">
              <div className="box_more_details">
                자세한 내용: {order_list.province}
                {!condition && (
                  <div>배송비: 3$가 이미 총 가격에 포함되어 있습니다.</div>
                )}
              </div>

              {order_list.shipping_company == "KIP" && (
                <div className="titlePrice">
                  <h4>합계 KIP :</h4>
                  <div className="container_total">
                    {total * convertCurrencyKIP()
                      ? (total * convertCurrencyKIP()).toLocaleString()
                      : "0"}{" "}
                    KIP
                  </div>
                </div>
              )}

              {order_list.shipping_company == "KRW" && (
                  <div className="titlePrice">
                    <h4>합계 KRW:</h4>
                    <div className="container_total">
                      ₩
                      {total && convertCurrency()
                        ? (total * convertCurrency()).toLocaleString()
                        : "0"}
                    </div>
                  </div>
                )}
            </div>
          </div>
          <div className="aplace-on">
            <div className="box_place">
              <div className="place-on">
                <div>
                  날짜 시간: {new Date(order_list.created_at).toLocaleString()}
                </div>
                <div>결제수단: {order_list.account_name}</div>
                <div>연락번호: +856 {order_list.tel}</div>
                <div>배송 주소: {order_list.district}</div>
                <div>상태: {order_list.status}</div>
              </div>
            </div>

            <div className="status btn">
              {order_list.status !== "Delivered" && (
                <button
                  type="submit"
                  onClick={ConfirmOrder}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderBill;
