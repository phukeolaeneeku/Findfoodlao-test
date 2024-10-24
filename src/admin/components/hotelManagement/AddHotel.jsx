import React, { useState } from "react";
import "./addHotel.css";
import AdminMenu from "../adminMenu/AdminMenu";
import axios from "axios";
import Swal from "sweetalert2";

function AddHotel() {
  const [hotellist, setHotellist] = useState({
    hotel: "", 
    room_number: "",
    address: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotellist({
      ...hotellist,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let data = JSON.stringify({
      "hotel": hotellist.hotel,
      "room_number": hotellist.room_number,
      "address": hotellist.address
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/hotel-qr`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };
    
    axios.request(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      setHotellist(response.data)
      Swal.fire({
        text: "Hotel added successfully!",
        icon: "success",
      });
      setHotellist({
        hotel: "", 
        room_number: "",
        address: ""
      })
    })
    .catch((error) => {
      console.error("Error:", error.response ? error.response.data : error.message);
        Swal.fire({
          text: "An error occurred while adding the hotel.",
          icon: "error",
        });
    });
  }

  return (
    <>
      <AdminMenu />
      <div className="container_from_hotel">
        <div className="container_from">
          <h4>Add Hotel</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="hotel"
              placeholder="Hotel name..."
              className="inputStyle"
              value={hotellist.hotel}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address..."
              className="inputStyle"
              value={hotellist.address}
              onChange={handleChange}
            />
            <input
              type="text"
              name="room_number"
              placeholder="Room number..."
              className="inputStyle"
              value={hotellist.room_number}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="BoxSubmit"
            >
              Add Hotel
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddHotel;
