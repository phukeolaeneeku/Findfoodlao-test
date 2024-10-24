import React, { useState, useEffect }  from "react";
import "./addInfo.css";
import AdminMenu from "../adminMenu/AdminMenu";
import axios from "axios";
import Swal from "sweetalert2";

function EditInfo() {

  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
    };

    axios
      .request(config)
      .then((response) => {
        const info = response.data[0];
        setEmail(info.email);
        setPhone1(info.tel1);
        setPhone2(info.tel2);
        setAddress(info.address);
        setName(info.name);
        setMessage(info.message);
      })
      .catch((error) => {
        console.error("Error fetching info:", error);
      });
  };

  const updateInfo = (event) => {
    event.preventDefault();

    let data = new FormData();
    data.append("tel1", phone1);
    data.append("tel2", phone2);
    data.append("email", email);
    data.append("address", address);
    data.append("name", name);
    data.append("message", message);

    const config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info/create_update",
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        Swal.fire({
          text: "The web info update was successful.",
          icon: "success",
        });
        setEmail("");
        setPhone1("");
        setPhone2("");
        setAddress("");
        setName("");
        setMessage("");
      })
      .catch((error) => {
        console.error("Error updating info:", error);
        Swal.fire({
          text: "There was an error updating the web info.",
          icon: "error",
        });
      });
  };


  return (
    <>
      <AdminMenu />
      <div className="container_from_info">
        <div className="box_container_from">
          <h4>Edit Web Info</h4>
          <form onSubmit={updateInfo}>
            <input
              type="text"
              name="email"
              value={name}
              placeholder="Name..."
              className="inputStyle"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Email..."
              className="inputStyle"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              name="phone"
              value={phone1}
              placeholder="Phone number..."
              className="inputStyle"
              onChange={(e) => setPhone1(e.target.value)}
            />
            <input
              type="text"
              name="phone"
              value={phone2}
              placeholder="Phone number..."
              className="inputStyle"
              onChange={(e) => setPhone2(e.target.value)}
            />
            <input
              type="text"
              name="address"
              value={address}
              placeholder="Address..."
              className="inputStyle"
              onChange={(e) => setAddress(e.target.value)}
            />
            <textarea
              name="description"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Description..."
              className="inputStyle"
            />
            <button type="submit" className="Btn_BoxSubmit">
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditInfo;
