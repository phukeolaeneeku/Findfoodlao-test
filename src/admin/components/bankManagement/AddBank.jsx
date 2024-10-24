import React, { useState, useEffect } from 'react';
import "./bank.css";
import { Link, useNavigate } from "react-router-dom";
import AdminMenu from "../adminMenu/AdminMenu";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const AddBank = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  const [is_has_bank_account, set_has_bank_account] = useState(false);
  var store_id = null;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  const MySwal = withReactContent(Swal);
  const [dataBank, setDataBank] = useState({
    name: "0",
    account_name: "0",
    account_number: "",
    image: null,
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDataBank((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API +
        `/store/bank-accounts/${store_id}/has_bank_account`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        set_has_bank_account(response.data.has_bank_account);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add validation check
    if (!dataBank.account_number.trim()) {
      MySwal.fire({
        text: "Please enter an account number",
        icon: "error",
      });
      return;
    }

    const formdata = new FormData();
    formdata.append("name", dataBank.name);
    formdata.append("account_name", dataBank.account_name);
    formdata.append("account_number", dataBank.account_number);
    formdata.append("store", store_id);

    if (is_has_bank_account === true) {
      const requestOptions = {
        method: "PUT",
        body: formdata,
        redirect: "follow",
      };

      fetch(
        `${import.meta.env.VITE_API}/store/bank-accounts/update/${store_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          MySwal.fire({
            text: "The bank account has been updated.",
            icon: "success",
          });
          navigate("/bank-account");
        })
        .catch((error) => console.error(error));
    } else {
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      fetch(`${import.meta.env.VITE_API}/store/bank-accounts`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          MySwal.fire({
            text: "The bank account has been added.",
            icon: "success",
          });
          navigate("/bank-account");
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <>
      <AdminMenu />
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-header">
            <h2>Add Account</h2>
            <button type='submit' className="add-edit-btn" onClick={handleSubmit}>Save</button>
          </div>
          <div className="bank-account-info">
            <label htmlFor="accountNumber">Account number</label>
            <input
              type="text"
              id="accountNumber"
              name="account_number"
              placeholder='Add account number...'
              className="bank-account-input"
              value={dataBank.account_number}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AddBank;