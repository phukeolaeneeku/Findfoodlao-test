import "./adminMenu.css";
import { IoDocumentText, IoLogOutOutline } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import user from "../../../images/user.png";
import { CiCamera } from "react-icons/ci";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import imageicon from "../../../images/imageicon.jpg";
import axios from "axios";
import { CiBank } from "react-icons/ci";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CiViewTable } from "react-icons/ci";
import { CiSquareInfo } from "react-icons/ci";
import { MdCurrencyExchange } from "react-icons/md";
import { FaBars } from "react-icons/fa";

const AdminMenu = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const storage = JSON.parse(window.localStorage.getItem("user"));
  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  var is_admin = false;
  if (localStorage.getItem("user")) {
    is_admin = JSON.parse(window.localStorage.getItem("user")).is_admin;
  }
  const [logo, set_logo] = useState(null);
  const [image, set_image] = useState(null);
  const [mainImageLogo, setMainImagLogo] = useState(null);
  const MySwal = withReactContent(Swal);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Choose logo image
  const [isPopupImageLogo, setPopupImageLogo] = useState(false);
  const togglePopupImageLogo = () => {
    setPopupImageLogo(true);
  };
  const togglePopupCancelImageLogo = () => {
    setPopupImageLogo(false);
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuToggling, setIsMenuToggling] = useState(false);

  const toggleMobileMenu = () => {
    setIsMenuToggling(true);
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setTimeout(() => setIsMenuToggling(false), 100);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isMobileMenuOpen &&
        !isMenuToggling &&
        !event.target.closest(".left") &&
        !event.target.closest(".mobile-menu-toggle")
      ) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMobileMenuOpen, isMenuToggling]);

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
        // console.log(response.data);
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
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_logo(response.data[0].logo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [logo]);

  ///Choose image handleImageLogo
  const handleImageLogo = (e) => {
    const file = e.target.files[0];
    set_image(file);
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setMainImagLogo([file]);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    return;
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setShowConfirmation(false);
  };

  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  const ChangeLogo = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("logo", image);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/web-info/create_update`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        MySwal.fire({
          text: "Update Logo image sussessful.",
          icon: "success",
        });

        setPopupImageLogo(false);
        window.location.reload(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <section id="dashboard">
        <div className={`left ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="menu">
            <NavLink to="/dashboard" className="link">
              <RxDashboard />
              <div>Dashboard</div>
            </NavLink>
            <NavLink to="/product-admin" className="link">
              <IoDocumentText />
              <div>Products</div>
            </NavLink>
            {is_admin === true && (
              <>
                <NavLink to="/users" className="link">
                  <BiUser />
                  <div>Users</div>
                </NavLink>
                <NavLink to="/currency" className="link">
                  <MdCurrencyExchange />
                  <div>Currency</div>
                </NavLink>
              </>
            )}
            <NavLink to="/bank-account" className="link">
              <CiBank />
              <div>Bank</div>
            </NavLink>
            <NavLink to="/info" className="link">
              <CiSquareInfo />
              <div>Info</div>
            </NavLink>
            <NavLink to="/hotel" className="link">
              <CiViewTable />
              <div>Hotels</div>
            </NavLink>

            <div onClick={() => setShowConfirmation(true)} className="link">
              <IoLogOutOutline />
              <div>Log Out</div>
            </div>
          </div>
        </div>
        {showConfirmation && (
          <div className="background_addproductpopup_box">
            <div className="hover_addproductpopup_boxs">
              <div className="box_logout">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="btn_foasdf">
                <button
                  className="btn_cancel btn_addproducttxt_popup"
                  onClick={handleCancelLogout}
                >
                  No
                </button>
                <button
                  className="btn_confirm btn_addproducttxt_popup"
                  onClick={handleConfirmLogout}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="right">
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <FaBars />
          </button>
          <div className="box_popupImage_logo">
            <NavLink to="/" className="container_logo">
              <img src={logo} alt="" />
            </NavLink>
            {is_admin === true && (
              <div className="popup_image_logo" onClick={togglePopupImageLogo}>
                <CiCamera id="box_icon_camera" />
              </div>
            )}

            {isPopupImageLogo && (
              <form
                className="background_addproductpopup_box"
                onSubmit={ChangeLogo}
              >
                <div className="hover_addproductpopup_box_image">
                  <div className="box_input_image">
                    <p>Edit Logo image</p>
                    <label className="popup_Border_Boximagae">
                      {mainImageLogo && mainImageLogo.length > 0 ? (
                        <img
                          src={URL.createObjectURL(mainImageLogo[0])}
                          alt="category"
                        />
                      ) : (
                        <img src={imageicon} alt="category" />
                      )}
                      <input
                        type="file"
                        id="img"
                        onChange={handleImageLogo}
                        required
                      />
                      <p className="box_choose_image">Choose img</p>
                    </label>
                  </div>
                  <div className="btn_foasdf">
                    <button
                      className="btn_cancel btn_addproducttxt_popup"
                      onClick={togglePopupCancelImageLogo}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn_confirm btn_addproducttxt_popup"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="boximage_admin">
            <NavLink to="#" className="userAdminImage">
              <div>{storage.email}</div>
              <img src={storage.image || user} alt="admin profile" />
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminMenu;
