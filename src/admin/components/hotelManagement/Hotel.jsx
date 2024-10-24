import React, { useEffect, useState } from "react";
import "./hotel.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import Swal from "sweetalert2";
import axios from "axios";

const TableHotel = () => {
  const [hotel, setHotel] = useState([]);

  const handleClickHotel = (id, qr_code) => {
    Swal.fire({
      title: `QR Code for Hotel ${id}`,
      html: `<img src="${qr_code}" alt="QR Code" style="max-width: 80%; height: auto;" />`,
      showCloseButton: true,
      confirmButtonText: "Close",
    });
  };

  useEffect(() => {
    fatchHotel();
  }, []);

  const fatchHotel = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/hotel-qr",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setHotel(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f44336",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: import.meta.env.VITE_API + `/store/hotel-qr/${id}`,
          headers: {},
        };

        axios
          .request(config)
          .then((response) => {
            Swal.fire({
              title: "Deleted!",
              text: "The hotel has been deleted.",
              icon: "success",
            });
            fatchHotel();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <>
      <AdminMenu />
      <div className="conainer_hotel">
        <div className="container_from">
          <div className="txtAddButton">
            <h2>Hotels</h2>
            <Link to="/add-hotel" className="btn_addtable">
              <BiPlus id="icon_BiPlus" />
              Add Hotel
            </Link>
          </div>

          <table className="tableStyle">
            <thead>
              <tr>
                <th className="thTdStyle">ID</th>
                <th className="thTdStyle">Hotel name</th>
                <th className="thTdStyle">Address</th>
                <th className="thTdStyle">Room_number</th>
                <th className="thTdStyle">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotel.map((hotel, index) => (
                <tr key={index}>
                  <td className="thTdStyle">{hotel.id}</td>
                  <td
                    className="thTdStyle"
                    onClick={() => handleClickHotel(hotel.id, hotel.qr_code)}
                  >
                    {hotel.hotel}
                  </td>
                  <td className="thTdStyle">{hotel.address}</td>
                  <td className="thTdStyle">{hotel.room_number}</td>

                  <td className="thTdStyles">
                    <Link
                      to={`/edit-hotel/${hotel.id}`}
                      className="buttonStyle"
                    >
                      Edit
                    </Link>
                    <button
                      className="deleteButtonStyle"
                      onClick={() => handleDeleteClick(hotel.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TableHotel;
