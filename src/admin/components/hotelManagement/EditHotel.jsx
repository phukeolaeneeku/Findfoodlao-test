import React, { useEffect, useState } from "react";
import "./addHotel.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EditHotel() {
  const { id } = useParams();
  const [hotel, setHotel] = useState("");
  const [address, setAddress] = useState("");
  const [room_number, setRoom_number] = useState("");

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/hotel-qr/${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setHotel(response.data.hotel);
        setAddress(response.data.address);
        setRoom_number(response.data.room_number);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const UpdateHotel = (event) => {
    event.preventDefault();

    let data = JSON.stringify({
      hotel: hotel,
      room_number: room_number,
      address: address,
    });

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/hotel-qr/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        Swal.fire({
          text: "The hotel update success.",
          icon: "success",
        });
        setHotel("");
        setRoom_number("");
        setAddress("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <AdminMenu />
      <div className="container_from_hotel">
        <div className="container_from">
          <h4>Edit Hotel</h4>
          <form onSubmit={UpdateHotel}>
            <input
              type="text"
              name="name"
              value={hotel}
              placeholder="Hotel name..."
              className="inputStyle"
              onChange={(e) => setHotel(e.target.value)}
            />
            <input
              type="text"
              name="address"
              value={address}
              placeholder="Address..."
              className="inputStyle"
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              name="room"
              value={room_number}
              placeholder="Room number..."
              className="inputStyle"
              onChange={(e) => setRoom_number(e.target.value)}
            />
            <button type="submit" className="BoxSubmit">
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditHotel;
