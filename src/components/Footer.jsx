import { Link, useLocation, useParams } from "react-router-dom";
import "./styles/footer.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineHome } from "react-icons/hi";
import { BsClipboardCheck } from "react-icons/bs";
import { BsCart3 } from "react-icons/bs";
import { GrContact } from "react-icons/gr";
import URL_Findfoodlao from "../images/URL_Findfoodlao.png";

const Footer = ({ set_category_name }) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");
  const [data, setData] = useState([]);

  const { hotelName, room_number, address } = useParams();

  const handleProductsAll = () => {
    if (typeof set_category_name === 'function') {
      set_category_name("");
    } else {
      console.warn('set_category_name is not a function');
    }
  };

  // Function to handle click on menu item
  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
    };

    axios
      .request(config)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section id="containerFooter">
      <footer className="footer">
        {data.map((footer, index) => (
          <div className="footer-content" key={index}>
            <div className="footconentBox">
              <h3>회사 소개</h3>
              <Link to="/" className="txt_pFoot">
                <img src={footer.logo} alt="" />
              </Link>
            </div>
            <div className="footconentBox">
              <h3>문의하기</h3>
              <p className="TextFooter">이메일: {footer.email}</p>
              <p className="TextFooter">전화: {footer.tel1}</p>
              <p className="TextFooter">전화: {footer.tel2}</p>
              <p className="TextFooter">주소: {footer.address}</p>
            </div>
            <div className="footconentBox">
              <h3>라오스 음식 찾기 URL</h3>
              <div className="foot_contentItem">
                <img
                  src={URL_Findfoodlao}
                  alt="FindFoodLao QR Code"
                  className="footer-qr"
                />
              </div>
            </div>
          </div>
        ))}
        <hr className="hrfoo" />
        <p className="lastFooter">저작권 &#169; 라오스 음식 찾기 2024</p>

        <div className="menubar">
          <Link
            to={
              hotelName && room_number && address
                ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}`
                : `/`
            }
            className={
              location.pathname === "/" ? "box-menu active" : "box-menu"
            }
            onClick={() => handleMenuClick("/")}
          >
            <span className="iconMenuSpan" onClick={handleProductsAll}>
              <HiOutlineHome />
            </span>
            <span>Home</span>
          </Link>

          {!hotelName && !room_number && !address && (
            <Link
              to={
                hotelName && room_number && address
                  ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/order`
                  : `/order`
              }
              className={
                location.pathname === "/order" ? "box-menu active" : "box-menu"
              }
            >
              <span className="iconMenuSpan" onClick={handleProductsAll}>
                <BsClipboardCheck />
              </span>
              <span>주문</span>
            </Link>
          )}

          <Link
            to={
              hotelName && room_number && address
                ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/cart`
                : `/cart`
            }
            className={
              location.pathname === "/cart" ? "box-menu active" : "box-menu"
            }
            onClick={() => handleMenuClick("/cart")}
          >
            <span className="iconMenuSpan" onClick={handleProductsAll}>
              <BsCart3 />
            </span>
            <span>카트</span>
          </Link>
          <Link
            to="https://open.kakao.com/o/gUkkzsIg"
            className="box-menu"
            onClick={() => handleMenuClick("https://open.kakao.com/o/gUkkzsIg")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="iconMenuSpan">
              <GrContact />
            </span>

            <span>카카오톡</span>
          </Link>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
