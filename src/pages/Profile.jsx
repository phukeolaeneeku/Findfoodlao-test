import React from "react";
import "./styles/profile.css";
import { MdDelete } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import profile from "../images/profile.jpg";
import withReactContent from "sweetalert2-react-content";

export const Profile = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);

  const storage = JSON.parse(window.localStorage.getItem("user"));
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

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

  const handleConfirmDelete = () => {
    handleDeleteAccount();
    setShowConfirmationDelete(false);
  };
  const handleCancelDelete = () => {
    setShowConfirmationDelete(false);
  };

  const user = localStorage.getItem("user");

  ///////////////// Function Delete ////////////////
  const handleDeleteAccount = async () => {
    try {
      const config = {
        method: "delete",
        url: `${import.meta.env.VITE_API}/user/my-page`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios(config);
      if (response.status === 204) {
        // Account deleted successfully
        MySwal.fire({
          text: "Account deleted successfully",
          icon: "success",
        });
        console.log("Account deleted successfully");
        localStorage.clear();
        navigate("/");
        // Perform any other actions (e.g., redirect to home page)
      } else {
        console.error("Failed to delete account:", response.data.message);
        alert("Failed to delete account:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="more-page">
          <h3>계정 설정</h3>
          <div className="profile-box">
            <div className="left-box">
              {storage && storage.image ? (
                <img src={storage.image} alt="" />
              ) : (
                <img src={profile} alt="" />
              )}
              <div className="user-name">
                이름 또는 이메일:{" "}
                {storage ? storage.nickname || storage.email : ""}
              </div>
            </div>
          </div>

          <div className="more-menu-list">
            <hr className="divider" />
            <div
              onClick={() => setShowConfirmation(true)}
              className="menu_icon"
            >
              <IoLogOutOutline id="icon_more" />
              <div className="txtPP">로그아웃 </div>
            </div>

            {showConfirmation && (
              <div className="background_addproductpopup_logoutAndDelete">
                <div className="hover_addproductpopup_logoutAndDelete">
                  <div className="box_logout">
                    <p>정말로 로그아웃하시겠습니까?</p>
                  </div>
                  <div className="btn_foasdf">
                    <button
                      className="btn_cancel btn_addproducttxt_popup"
                      onClick={handleCancelLogout}
                    >
                      아니요
                    </button>
                    <button
                      className="btn_confirm btn_addproducttxt_popup"
                      onClick={handleConfirmLogout}
                    >
                      예
                    </button>
                  </div>
                </div>
              </div>
            )}

            <hr className="divider" />
            <div
              className="menu_icon"
              onClick={() => setShowConfirmationDelete(true)}
            >
              <MdDelete id="icon_more" />
              <div className="txtPP">계정 삭제</div>
            </div>

            {showConfirmationDelete && (
              <div className="background_addproductpopup_logoutAndDelete">
                <div className="hover_addproductpopup_logoutAndDelete">
                  <div className="box_logout">
                    <p>삭제하시겠습니까?</p>
                  </div>
                  <div className="btn_foasdf">
                    <button
                      className="btn_cancel btn_addproducttxt_popup"
                      onClick={handleCancelDelete}
                    >
                      아니요
                    </button>
                    <button
                      className="btn_confirm btn_addproducttxt_popup"
                      onClick={handleConfirmDelete}
                    >
                      예
                    </button>
                  </div>
                </div>
              </div>
            )}

            <hr className="divider" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
export default Profile;
