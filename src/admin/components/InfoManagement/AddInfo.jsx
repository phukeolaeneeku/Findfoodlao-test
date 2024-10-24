import React, { useState } from "react";
import "./addInfo.css";
import AdminMenu from "../adminMenu/AdminMenu";
import axios from "axios";
import Swal from "sweetalert2";

function AddInfo() {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    phone1: "",
    phone2: "",
    address: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    let data = JSON.stringify({
      email: info.email,
      tel1: info.phone1,
      tel2: info.phone2,
      address: info.address,
      name: info.name,
      message: info.message,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setInfo(response.data)
        Swal.fire({
          text: "Web info added successfully!",
          icon: "success",
        });
        setInfo({
          name: "",
          email: "",
          phone1: "",
          phone2: "",
          address: "",
          message: "",
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          text: "Failed to add web info. Please try again.",
          icon: "error",
        });
      });
  };

  return (
    <>
      <AdminMenu />
      <div className="container_from_info">
        <div className="box_container_from">
          <h4>Add Web info</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={info.name}
              onChange={handleChange}
              placeholder="Name..."
              className="inputStyle"
            />
            <input
              type="text"
              name="email"
              value={info.email}
              onChange={handleChange}
              placeholder="Email..."
              className="inputStyle"
            />
            <input
              type="text"
              name="phone1"
              value={info.phone1}
              onChange={handleChange}
              placeholder="Phone number..."
              className="inputStyle"
            />
            <input
              type="text"
              name="phone2"
              value={info.phone2}
              onChange={handleChange}
              placeholder="Phone number..."
              className="inputStyle"
            />
            <input
              type="text"
              name="address"
              value={info.address}
              onChange={handleChange}
              placeholder="Address..."
              className="inputStyle"
            />
            <textarea
              name="description"
              value={info.message}
              onChange={handleChange}
              placeholder="Description..."
              className="inputStyle"
            />
            <button type="submit" className="Btn_BoxSubmit">
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddInfo;
