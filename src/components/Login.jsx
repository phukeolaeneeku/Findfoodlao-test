import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./styles/login.css";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const MySwal = withReactContent(Swal);

  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
  };
  const handlePass = (e) => {
    const value = e.target.value;
    setPass(value);
  };

  const HandleLogin = (e) => {
    if (!email) {
      MySwal.fire({
        text: "이메일을 입력해주세요!",
        icon: "question",
      });
      return;
    }
    if (!pass) {
      MySwal.fire({
        text: "비밀번호를 입력해주세요!",
        icon: "question",
      });
      return;
    }

    e.preventDefault();
    let data = JSON.stringify({
      email: email,
      password: pass,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,

      url: import.meta.env.VITE_API + "/user/signin",

      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((res) => {
        const result = res.data;
        const user = {
          email: result.email,
          image: result.image,
          is_admin: result.is_admin,
          store_id: result.store_id,
          origin_store_name: result.origin_store_name,
          user_id: result.user_id,
          user_name: result.user_name,
          is_first: result.is_first,
        };
        const token = result.token.access;
        if (token) {
          window.localStorage.setItem("token", token);
        }
        window.localStorage.setItem("user", JSON.stringify(user));
        navigate("/", { replace: true });
      })
      .catch((error) => {
        MySwal.fire({
          text: "비밀번호가 잘못되었습니다.",
          icon: "question",
        });

        if (error.response.data.message == "Email does not exist.") {
          MySwal.fire({
            text: "이메일이 존재하지 않습니다. 먼저 등록해주세요!",
            icon: "question",
          });
          navigate("/login", { replace: true });
          MySwal.fire({
            text: "이메일이 존재하지 않습니다.",
            icon: "question",
          });
        }
      });
  };

  return (
    <>
      <div className="login">
        <div className="login-container">
          <Header />
          <h4>사용자 등록</h4>
          <h2 className="login-title">
            서비스를 이용하시려면 로그인을 해주세요!
          </h2>
          <form className="login-form" onSubmit={HandleLogin}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmail}
              className="login-input"
              placeholder="이메일을 입력해주세요..."
            />
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={pass}
              onChange={handlePass}
              className="login-input"
              placeholder="비밀번호를 입력해주세요..."
            />
            <Link to="/find-password"  className="forgot-password">
              비밀번호 찾기
            </Link>
            <button type="submit" className="login-button">
              로그인
            </button>
          </form>
          <div className="signup-link">
            이번이 처음이신가요? <Link to="/register" >회원가입</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
