import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./styles/checkout.css";
import { FiCopy } from "react-icons/fi";

const Checkout = () => {
  // State variables
  const token = localStorage.getItem("token");
  const { hotelName, room_number, address, category } = useParams();
  const location = useLocation();
  const { order } = location.state || {};
  const { items } = order || {};

  const [tel, setTel] = useState("");

  const [account_name, set_account_name] = useState("");
  const [shipping_company, setShippingCompany] = useState("");
  const [more, set_more] = useState([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState(
    hotelName && room_number && address
      ? `${hotelName}, ${room_number}, ${address}`
      : ""
  );

  const [productsList, setProductsList] = useState([]);

  var store_id = null;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  const [dataBank, setDataBank] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("KRW");
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  ///////////// ProductsList ///////////////
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/store/?category=${category}`)
      .then((response) => setProductsList(response.data))
      .catch((error) => console.error("Error fetching products list:", error));
  }, [category]);

  // Exchange rate states
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    KRW: 1,
    KIP: 1,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (items && Array.isArray(items)) {
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
      setProducts(items.map((item) => `${item.name} x${item.quantity}`));
    }
  }, [items]);

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
    setFromCurrency(paymentMethod);
    if (paymentMethod === "USD") setToCurrency("KRW");
    else if (paymentMethod === "KRW" || paymentMethod === "KIP")
      setToCurrency("USD");
  }, [paymentMethod]);

  const getConvertedAmount = (currency) => {
    return ((totalPrice + 3) * exchangeRates[currency]).toFixed(2);
  };

  const handleTel = (e) => {
    setTel(e.target.value);
  };

  const handleProvince = (e) => {
    const value = e.target.value;
    setProvince(value);
  };

  const validateTime = () => {
    // รับเวลาปัจจุบันในเขตเวลากรุงเทพ
    const getBangkokTime = () => {
      return new Date(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Bangkok",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };

    const currentTime = getBangkokTime();
    const [selectedHours, selectedMinutes] = province.split(":").map(Number);

    // สร้าง Date object สำหรับเวลาที่เลือก
    const selectedTime = new Date(currentTime);
    selectedTime.setHours(selectedHours, selectedMinutes, 0, 0);

    // คำนวณเวลาขั้นต่ำ (3 ชั่วโมงจากปัจจุบัน)
    const minTime = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);

    // 카테고리에 따라 최대 시간 설정
    let maxTime = new Date(selectedTime);
    let category = items[0]?.category; // 상품에 category 필드가 있다고 가정
    if (category === "김밥") {
      maxTime.setHours(18, 0, 0, 0);
    } else if (category === "족발") {
      maxTime.setHours(16, 0, 0, 0);
    } else {
      maxTime.setHours(16, 0, 0, 0); // 기본 마감 시간
    }

    // สร้าง Date object สำหรับ 11:00 น. ของวันถัดไป
    const nextDayElevenAM = new Date(currentTime);
    nextDayElevenAM.setDate(nextDayElevenAM.getDate() + 1);
    nextDayElevenAM.setHours(11, 0, 0, 0);

    if (
      selectedTime < minTime ||
      selectedTime > maxTime ||
      (selectedTime >= maxTime && selectedTime < nextDayElevenAM)
    ) {
      let message = "";
      let newTime = new Date(currentTime);

      if (selectedTime < minTime) {
        message = "현재 시간으로부터 최소 3시간 이후의 시간을 선택해주세요.";
        newTime = new Date(minTime);
      } else if (selectedTime >= maxTime && selectedTime < nextDayElevenAM) {
        message = `${maxTime.getHours()}:00부터 다음날 오전 11시까지는 선택할 수 없습니다.`;
        newTime = new Date(nextDayElevenAM);
      } else if (selectedTime > maxTime) {
        message = `${maxTime.getHours()}:00 이전의 시간을 선택해주세요.`;
        newTime = new Date(maxTime);
      }

      Swal.fire({
        title: "경고",
        text: message,
        icon: "warning",
        confirmButtonText: "확인",
      });

      // 새로운 시간 설정
      const newHours = newTime.getHours().toString().padStart(2, "0");
      const newMinutes = newTime.getMinutes().toString().padStart(2, "0");
      setProvince(`${newHours}:${newMinutes}`);
    }
  };

  const handleDistrict = (e) => {
    const value = e.target.value;
    if (hotelName && room_number && address) {
      setDistrict(`${hotelName}, ${room_number}, ${address}`);
    } else {
      setDistrict(value);
    }
  };

  const handleAccountName = (e) => {
    const value = e.target.value;
    set_account_name(value);
  };

  useEffect(() => {
    if (paymentMethod == "KIP") {
      setShippingCompany("KIP");
    }
    if (paymentMethod == "KRW") {
      setShippingCompany("KRW");
    }
  }, [paymentMethod]);

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API +
        `/store/bank-accounts/detail/?store_id=${store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setDataBank(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [store_id]);

  const copyToClipboard = () => {
    if (dataBank.length > 0 && dataBank[0].account_number) {
      navigator.clipboard.writeText(dataBank[0].account_number);
      MySwal.fire({
        text: "계좌번호가 클립보드에 복사되었습니다!",
        icon: "success",
      });
    } else {
      MySwal.fire({
        text: "계좌 정보를 찾을 수 없습니다.",
        icon: "error",
      });
    }
  };
  const copyToClipboardKIP = () => {
    const kipAccountNumber = "05820010000014855";
    navigator.clipboard.writeText(kipAccountNumber);
    MySwal.fire({
      text: "계좌번호가 클립보드에 복사되었습니다!",
      icon: "success",
    });
  };

  const handlePayment = async () => {
    if (!tel || !district) {
      MySwal.fire({
        text: !tel
          ? "연락처나 카카오톡 아이디를 추가해주세요!"
          : "주소를 추가해주세요!",
        icon: "question",
      });
      return;
    }
    // if (!district) {
    //   MySwal.fire({
    //     text: "주소를 추가해주세요!",
    //     icon: "question",
    //   });
    //   return;
    // }

    const products = items.map((item, index) => ({
      product: item.id,
      quantity: item.quantity,
      price: item.price,
      color: item.color || "0",
      size: item.size || "0",
      additional_request: more[index]?.description || "",
    }));

    let data = JSON.stringify({
      user: user.user_id,
      store: items[0].store,
      tel: tel,
      status: "Pending",
      total_prices: totalPrice,
      province: province,
      district: district,
      shipping_company: shipping_company, // Placeholder
      branch: "0", // Placeholder
      account_name: account_name,
      items: products,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/order/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    setLoading(true);
    try {
      const response = await axios.request(config);
      MySwal.fire({
        text: "주문이 완료되었습니다.",
        icon: "success",
      });
      // จัดการการนำทาง
      const destination =
        hotelName && room_number && address
          ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}`
          : "/";
      navigate(destination);
    } catch (error) {
      console.error("Error details:", error.response?.data);
      if (error.response) {
        const quantity = error.response.data?.quantity;
        if (error.response.status === 400) {
          if (quantity === 0) {
            MySwal.fire({
              text: "제품이 품절되었습니다!",
              icon: "info",
            });
          } else {
            MySwal.fire({
              text: `주문 처리 중 오류가 발생했습니다: ${
                error.response.data?.message || "알 수 없는 오류"
              }`,
              icon: "error",
            });
          }
        }
      } else {
        MySwal.fire({
          text: "네트워크 오류가 발생했습니다. 다시 시도해 주세요.",
          icon: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="checkout-container">
        <Header />
        {items &&
          items.map((item, index) => (
            <div className="product-item" key={index}>
              <img
                src={item.images}
                alt={item.name}
                className="product-image"
              />
              <div className="product-details">
                <div className="checkout_detail">
                  <div className="txt_Checkout">제품명:</div> {item.name}
                </div>
                <div className="checkout_detail">
                  <div>가격:</div>
                  <div className="checkout_price">${item.price.toFixed(2)}</div>
                </div>
                <div>수량: {item.quantity}</div>
                <div>설명: {item.description}</div>
              </div>
            </div>
          ))}

        <div className="order-details">
          {items &&
            (items.some((item) => {
              if (["김밥", "족발"].includes(item.category)) {
                const product = productsList.find((p) => p.id === item.id);
                return (
                  !product ||
                  product.quantity === 0 ||
                  item.quantity > product.quantity
                );
              }
              return false;
            }) ||
              (productsList &&
                items.some((item) => {
                  const product = productsList.find((p) => p.id === item.id);
                  return (
                    !product ||
                    (product.quantity === 0 &&
                      !["음료", "기타", "주류"].includes(item.category)) ||
                    (item.quantity > product.quantity &&
                      !["음료", "기타", "주류"].includes(item.category))
                  );
                }))) ? (
            <div className="reservation-time">
              <label htmlFor="province">
                제품이 충분하지 않습니다. 약속 시간을 예약해 주세요(이번에는
                배송해 드립니다):
              </label>
              <input
                type="time"
                id="province"
                placeholder="설명..."
                className="address-input"
                value={province}
                onChange={handleProvince}
                onBlur={validateTime}
              />
            </div>
          ) : null}

          <label htmlFor="tel">연락하다:</label>
          <input
            type="text"
            value={tel}
            onChange={handleTel}
            placeholder="전화번호나 카카오톡 아이디..."
            className="address-input"
          />

          <label htmlFor="district">주소:</label>
          <input
            type="text"
            value={district}
            onChange={handleDistrict}
            placeholder="상세 주소 아파트, 동, 호수"
            className="address-input"
          />

          <div className="address-note">
            *배달의 경우 호텔객실정보, 컨벤션센터 정보 필요로 입력하세요.
          </div>

          <select
            className="currency-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {/* <option value="USD">USD</option> */}
            <option selected value="KRW">
              KRW
            </option>
            <option value="KIP">KIP</option>
          </select>

          {paymentMethod === "KIP" && (
            <>
              <label htmlFor="account_name">
                주문자 이름으로 송금해주세요.
              </label>
              <input
                type="text"
                id="account_name"
                className="address-input"
                value={account_name}
                onChange={handleAccountName}
                placeholder="송금인을 주문자 이름으로 설정해서 보내주세요..."
              />
              {/* <div className="box_transfer_p_line">예금주 이창섭 신한은행</div> */}
              <div className="boxaccount_number">
                <div className="boxaccount_number_p">
                  <div>계좌번호:</div>
                  <div>05820010000014855</div>
                </div>
                <FiCopy
                  className="iconnn_copy_account"
                  onClick={copyToClipboardKIP}
                />
              </div>
            </>
          )}
          {paymentMethod === "KRW" && (
            <>
              <label htmlFor="account_name">
                주문자 이름으로 송금해주세요.
              </label>
              <input
                type="text"
                id="account_name"
                className="address-input"
                value={account_name}
                onChange={handleAccountName}
                placeholder="송금인을 주문자 이름으로 설정해서 보내주세요..."
              />
              {/* <div className="box_transfer_p_line">예금주 이창섭 신한은행</div> */}
              <div className="boxaccount_number">
                <div className="boxaccount_number_p">
                  <div>계좌번호:</div>
                  {dataBank.length > 0 && dataBank[0].account_number && (
                    <div>{dataBank[0].account_number}</div>
                  )}
                </div>
                <FiCopy
                  className="iconnn_copy_account"
                  onClick={copyToClipboard}
                />
              </div>
            </>
          )}

          <div className="delivery-note">
            배송비: $3 가 이미 총 가격에 포함되어 있습니다.
          </div>

          <div className="total-price">
            총 가격:
            {paymentMethod === "USD" && `$${getConvertedAmount("USD")}`}
            {paymentMethod === "KRW" && `₩${getConvertedAmount("KRW")}`}
            {paymentMethod === "KIP" && `₭${getConvertedAmount("KIP")}`}
          </div>

          <button
            className="order-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "주문 처리 중..." : "주문하다"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;