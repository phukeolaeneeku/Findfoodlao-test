import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { FaMagnifyingGlass, FaCartShopping, FaRegUser } from "react-icons/fa6";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";
import axios from "axios";
import "./styles/header.css";
import Maps from "./Maps";
import { GrMap } from "react-icons/gr";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Header({ set_category_name }) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [logo, setLogo] = useState(null);
  const { hotelName, room_number, address } = useParams();
  const [search, setSearch] = useState(
    new URLSearchParams(window.location.search).get("search") || ""
  );
  const [isMap, setIsMap] = useState(false);
  const MySwal = withReactContent(Swal);
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

  const handleButtonClick = () => {
    setShowPopup(true);
    if (showPopup) {
      MySwal.fire({
        text: "장바구니 추가는 현재 비활성화되어 있습니다.",
        icon: "info",
      }).then(() => {
        setShowPopup(false);
        navigate("/"); // เปลี่ยนเส้นทางไปยังหน้าแรก
      });
    }
  };

  useEffect(() => {
    if (hotelName && room_number && address) {
      return;
    }

    if (token) {
      const checkToken = async () => {
        try {
          const response = await axios.post(
            import.meta.env.VITE_API + "/user/check-token",
            { token },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.result !== "success") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          console.error(error);
        }
      };
      checkToken();
    }
  }, [token, navigate, hotelName, room_number, address]);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API + "/store/web-info"
        );
        setLogo(response.data[0]?.logo || null);
      } catch (error) {
        console.error("Error fetching store info:", error);
      }
    };
    fetchStoreInfo();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchPath =
      hotelName && room_number && address
        ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/search/?search=${search}`
        : `/search/?search=${search}`;

    navigate(searchPath);
  };

  const handleProductsAll = () => {
    set_category_name("");
  };

  const handleMap = () => {
    setIsMap(!isMap);
  };

  return (
    <header className="header">
      <div className="content">
        {isMap && (
          <div className="maps">
            <Maps />
          </div>
        )}
        <div className="logo">
          <Link
            to={
              hotelName && room_number && address
                ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}`
                : `/`
            }
          >
            <img
              src={logo}
              alt="Logo"
              onClick={handleProductsAll}
              style={{ display: logo ? "block" : "none" }}
            />
          </Link>
        </div>
        <nav className="menu-left">
          <ul>
            <li>
              <NavLink
                to={
                  hotelName && room_number && address
                    ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}`
                    : `/`
                }
              >
                Home
              </NavLink>
            </li>
            {!hotelName && !room_number && !address && (
              <li>
                <NavLink
                  to={
                    hotelName && room_number && address
                      ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/order`
                      : `/order`
                  }
                  disabled={showPopup}
                  onClick={handleButtonClick}
                >
                  주문
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="https://open.kakao.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                카카오톡
              </NavLink>
            </li>
          </ul>
        </nav>
        <button className="btnmap" onClick={handleMap}>
          <GrMap />
        </button>
        <form className="searchbar" onSubmit={handleSearch}>
          <label htmlFor="search">
            <FaMagnifyingGlass />
          </label>
          <input
            type="text"
            id="search"
            placeholder="검색..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {user ? (
          <nav className="menu-right">
            <ul>
              <li
                className={location.pathname.includes("/cart") ? "active" : ""}
              >
                <NavLink
                  to={
                    hotelName && room_number && address
                      ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/cart`
                      : `/cart`
                  }
                  disabled={showPopup}
                  onClick={handleButtonClick}
                >
                  <FaCartShopping id="icon_FaCartShopping" />
                </NavLink>
              </li>
              {!user.is_admin && (
                <li>
                  <NavLink to="/profile">
                    <FaRegUser />
                  </NavLink>
                </li>
              )}
              {user.is_admin && (
                <li>
                  <NavLink to="/dashboard">
                    <AiOutlineDashboard />
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        ) : (
          <nav className="menu-right">
            <ul>
              <li
                className={location.pathname.includes("/cart") ? "active" : ""}
              >
                <NavLink
                  to={
                    hotelName && room_number && address
                      ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/cart`
                      : `/cart`
                  }
                >
                  <FaCartShopping id="icon_FaCartShopping" />
                </NavLink>
              </li>

              {!hotelName && !room_number && !address && (
                <li>
                  <NavLink
                    to={
                      hotelName && room_number && address
                        ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/login`
                        : `/login`
                    }
                    className="Box_Icon_Login"
                  >
                    로그인
                    <BiLogIn id="icon_BiLogIn" />
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
