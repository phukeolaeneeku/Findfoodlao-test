import React from "react";
import "./orderpage.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import Swal from "sweetalert2";

const OrderProcess = () => {
  const token = localStorage.getItem("token");
  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  const [order_list, set_order_list] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
        `/store/order/processing/?store_id=${store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data.orders));
        set_order_list(response.data.orders);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const totalPages = Math.ceil(order_list.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = order_list.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage(currentPage === totalPages ? totalPages : currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage === 1 ? 1 : currentPage - 1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    pages.push(
      <button
        key={1}
        style={{
          padding: "10px 20px",
          margin: "0 5px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "3px",
          backgroundColor: currentPage === 1 ? "#007bff" : "white",
          color: currentPage === 1 ? "white" : "black",
          border: "1px solid #ddd",
        }}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    if (startPage > 2) {
      pages.push(
        <span key="start-ellipsis" style={{ margin: "0 10px" }}>
          ...
        </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          style={{
            padding: "10px 20px",
            margin: "0 5px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "3px",
            backgroundColor: currentPage === i ? "#007bff" : "white",
            color: currentPage === i ? "white" : "black",
            border: "1px solid #ddd",
          }}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(
        <span key="end-ellipsis" style={{ margin: "0 10px" }}>
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          style={{
            padding: "10px 20px",
            margin: "0 5px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "3px",
            backgroundColor: currentPage === totalPages ? "#007bff" : "white",
            color: currentPage === totalPages ? "white" : "black",
            border: "1px solid #ddd",
          }}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  /////////// handleDeleteClick ///////////
  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f44336",
      confirmButtonText: "  Yes  ",
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: import.meta.env.VITE_API + `/store/order/delete/${id}`,
          headers: {
            "Content-Type": "application/json",
          },
        };

        axios
          .request(config)
          .then((response) => {
            Swal.fire({
              title: "Deleted!",
              text: "The order has been deleted success.",
              icon: "success",
            });

            set_order_list(order_list.filter((order) => order.id !== id));
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
      <section id="menager">
        <div className="container_box_orderpage">
          <div className="box_head_searchs">
            <h2>Orders Processing</h2>
          </div>

          {currentOrders.map((order, index) => (
            <div className="box_users_order" key={index}>
              <div className="box_order_text">
                <p>No: {order.id}</p>
              </div>
              <div className="box_container_time">
                <p>{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className="container_order_icon">
                <div className="btn_pending">{order.status}</div>
                <Link to={`/orderbill-admin/${order.id}`} className="btn_view">
                  View
                </Link>
                <button
                  className="deleteButton_Style"
                  onClick={() => handleDeleteClick(order.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {loading ? (
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
          ) : order_list.length === 0 ? (
            <div className="heade_productorder_store">
              <p>No Order</p>
            </div>
          ) : (
            <p></p>
          )}

          {totalPages > 1 && (
            <div className="pagination" style={{ textAlign: "center" }}>
              <button
                style={{
                  padding: "10px 20px",
                  margin: "0 5px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                }}
                disabled={currentPage === 1}
                onClick={prevPage}
              >
                Previous
              </button>
              {renderPageNumbers()}
              <button
                style={{
                  padding: "10px 20px",
                  margin: "0 5px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  background: "#FF4F16",
                  color: "white",
                  border: "none",
                }}
                disabled={currentPage === totalPages}
                onClick={nextPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default OrderProcess;
