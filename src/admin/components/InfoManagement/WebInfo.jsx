import React, { useEffect, useState } from "react";
import "./info.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { Link, useNavigate } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { useParams } from "react-router-dom";

const WebInfo = () => {
    const { id } = useParams();
    const [webInfo, setWebInfo] = useState([]);
    const [selectedInfo, setSelectedInfo] = useState({});
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchInfo();
    }, []);
  
    const fetchInfo = () => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_API + "/store/web-info",
        headers: {},
      };
  
      axios
        .request(config)
        .then((response) => {
          setWebInfo(response.data);
          setSelectedInfo(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    const handleEditClick = (info) => {
      setSelectedInfo(info);
      navigate(`/edit-info`); 
    };

  return (
    <>
      <AdminMenu />
      <div className="conainer_info">
        <div className="box_container">
          <div className="headerAddButton">
            <h2>Management Web info</h2>
            <Link to="/add-info" className="btn_addinfo">
              <BiPlus id="iconBiPlus" />
              Add Info
            </Link>
          </div>

          {webInfo.length > 0 ? (
            webInfo.map((info, index) => (
              <div className="txt_container_info" key={index}>
                <p className="txtP">Name: {info.name}</p>
                <p className="txtP">Email: {info.email}</p>
                <p className="txtP">Phone number: {info.tel1}</p>
                <p className="txtP">Phone number: {info.tel2}</p>
                <p className="txtP">Address: {info.address}</p>
                <p className="txtP">Message: {info.message}</p>

                <div className="container_btn">
                  <button
                    className="Btn_edit"
                    onClick={() => handleEditClick(info)}
                  >
                    Edit
                  </button>
                  <button className="Btn_delete">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <div className="box_Orderpage_RotatingLines">
              <RotatingLines
                visible={true}
                height="45"
                width="45"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WebInfo;
