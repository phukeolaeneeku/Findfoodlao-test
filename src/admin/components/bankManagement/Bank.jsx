import React from "react";
import "./bank.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Bank = () => {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const user = localStorage.getItem("user");
  var store_id = null;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  const [dataBank, setDataBank] = useState([]);

  console.log("dataBank.....", dataBank)

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
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [store_id]);

  return (
    <>
      <AdminMenu />
      <div className="payment-container">
        <h2 className="store-name">Store:{storage.origin_store_name}</h2>

        {dataBank.length === 0 ? (
          <div className="payment-card">
            <div className="payment-header">
              <h2>Payment</h2>
              <p className="no-reviews-message">
              You don't have Back account. Please add it!
            </p>
              <Link to="/add-account" className="add-edit-btn">
                Add/Edit
              </Link>
            </div>
          </div>
        ) : (
          <div className="payment-card">
            <div className="payment-header">
              <h2>Payment</h2>
              <Link to="/add-account" className="add-edit-btn">
                Add/Edit
              </Link>
            </div>
            <div className="account-info">
              <div>Account number: {dataBank[0].account_number}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bank;
