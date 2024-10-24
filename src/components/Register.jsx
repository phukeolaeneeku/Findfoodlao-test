import React, { useState, useEffect } from "react";
import "./styles/register.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Register() {
  const locataion = useLocation();
  const navigate = useNavigate();
  const [errorText, set_errorText] = useState("");
  const user_tyep = "1";
  const MySwal = withReactContent(Swal);

  const [timer, set_timer] = useState({
    minute: 0,
    second: 0,
  });
  const { minute, second } = timer;
  const [data, set_data] = useState({
    category: "",
    email: "",
    code: "",
    nickname: "",
    password: "",
    password2: "",
    name: "",
    phone: "",
    address: "",
    sub_address: "",
    company_number: "",
    introduce: "",
  });

  function onChange(e) {
    const { name, value } = e.target;
    set_data({
      ...data,
      [name]: value,
    });
  }

  const SignUp = () => {
    if (!data.email) {
      MySwal.fire({
        text: "이메일을 입력해주세요!",
        icon: "question",
      });
      return;
    }
    if (!data.code) {
      MySwal.fire({
        text: "코드를 입력해주세요!",
        icon: "question",
      });
      return;
    }
    if (!data.password) {
      MySwal.fire({
        text: "비밀번호를 입력해주세요!",
        icon: "question",
      });
      return;
    }
    if (!data.password2) {
      MySwal.fire({
        text: "확인 비밀번호를 입력해주세요!",
        icon: "question",
      });
      return;
    }
    if (data.password != data.password2) {
      MySwal.fire({
        text: "비밀번호가 일치하지 않습니다!",
        icon: "question",
      });
      return;
    }
    if (data.password.length <= 7 || data.password2.length <= 7) {
      MySwal.fire({
        text: "비밀번호는 8자 이상이어야 합니다!",
        icon: "question",
      });
      return;
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        navigate("/login");
        return;
      })
      .catch((err) => {
        if (err.response && err.response.data.message) {
          MySwal.fire({
            text: `${err.response.data.message}`,
            icon: "question",
          });
        } else {
          console.log("This is an unknown error.");
        }
      });
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      if (second > 0) {
        set_timer({
          ...timer,
          second: second - 1,
        });
      }
      if (second === 0) {
        if (minute === 0) {
          clearInterval(countdown);
        } else {
          set_timer({
            minute: minute - 1,
            second: 59,
          });
        }
      }
    }, 1000);
    return () => {
      clearInterval(countdown);
    };
  }, [timer]);

  return (
    <>
      <Header />
      <div className="register-container">
        <h4>사용자 등록</h4>
        <p>사용자 등록을 진행 중입니다!</p>
        <form onSubmit={SignUp}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                onChange={onChange}
                value={data.email}
                placeholder="이메일을 입력해주세요..."
              />
              {minute > 0 || second > 0 ? (
                <button type="button" className="verify-button">
                  {minute < 10 ? `0${minute}` : minute}:
                  {second < 10 ? `0${second}` : second}
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (data.email.length > 0) {
                      set_timer({ minute: 3, second: 0 });
                      let config = {
                        method: "post",
                        maxBodyLength: Infinity,
                        url: import.meta.env.VITE_API + "/user/send-email",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        data: data,
                      };

                      axios
                        .request(config)
                        .then((response) => {
                          console.log(JSON.stringify(response.data));
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    } else {
                      set_errorText("Please enter your e-mail.");
                    }
                  }}
                  type="button"
                  className="verify-button"
                >
                  확인하다
                </button>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="code">코드 확인</label>
            <input
              type="text"
              id="code"
              name="code"
              onChange={onChange}
              value={data.code}
              placeholder="인증번호를 입력해주세요..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              name="password"
              onChange={onChange}
              value={data.password}
              placeholder="비밀번호를 입력해주세요..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">완성된 비밀번호</label>
            <input
              type="password"
              id="password2"
              name="password2"
              onChange={onChange}
              value={data.password2}
              placeholder="확인 비밀번호를 입력해주세요..."
            />
          </div>
          <button type="submit" className="submit-button">
            등록하다
          </button>
        </form>
        <p className="login-link">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </div>
      <Footer />
    </>
  );
}

export default Register;
