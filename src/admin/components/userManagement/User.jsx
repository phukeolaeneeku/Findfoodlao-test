import React, { useEffect, useState } from "react";
import "./user.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { Link, useNavigate } from "react-router-dom";
import profile from "../../../images/profile.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { RotatingLines } from "react-loader-spinner";

const Users = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const itemsPerPage = 5;
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/user/check-token`,
          { token },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.result !== "success") {
          localStorage.clear();
          navigate("/loginuser");
        }
      } catch (error) {
        localStorage.clear();
        navigate("/loginuser");
      }
    };

    checkToken();
  }, [token, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/user/client-users`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f44336",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API}/user/client-users/${id}`
          );
          MySwal.fire({
            text: "Delete user successful.",
            icon: "success",
          });
          setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
          console.error("Error deleting user:", error);
          MySwal.fire({
            text: "Error deleting user.",
            icon: "error",
          });
        }
      }
    });
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const nextPage = () =>
    setCurrentPage((prev) => (prev === totalPages ? totalPages : prev + 1));
  const prevPage = () => setCurrentPage((prev) => (prev === 1 ? 1 : prev - 1));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <>
      <AdminMenu />
      <div className="container_body_adminuser">
        <div className="container_box_adminusers">
          <div className="box_users">
            <h2>Users</h2>
          </div>
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
          ) : users.length === 0 ? (
            <p className="no-reviews-message">No Users</p>
          ) : (
            currentUsers.map((user, index) => (
              <div className="box_users_user" key={index}>
                <div className="box_dp_txtandiamge">
                  <div className="box_user_img">
                    <img src={user.profile_image || profile} alt="" />
                  </div>
                  <div className="box_user_text">
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="btn_box_Cont">
                  <button
                    className="delete_storeDetails"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                  <Link
                    to={`/user_details/${user.id}`}
                    className="viewMore_storeDetails"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          )}

          {users.length > itemsPerPage && (
            <div className="box_container_next_resume">
              <button
                className="box_prev_left_resume"
                disabled={currentPage === 1}
                onClick={prevPage}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <div className="box_num_resume" key={index}>
                  <button
                    className={`num_admin_resume ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </div>
              ))}
              <button
                className="box_prev_right_resume"
                disabled={currentPage === totalPages}
                onClick={nextPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
