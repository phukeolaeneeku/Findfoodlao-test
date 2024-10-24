import "./user_details.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import profile from "../../../images/profile.jpg";
import axios from "axios";
import Swal from "sweetalert2";

const User_details = () => {
  const id = useParams().id;
  const navigate = useNavigate();
  const [user, set_user] = useState([]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/client-users",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_user(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/user/client-users/${id}/get`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_user(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: import.meta.env.VITE_API + `/user/client-users/${id}`,
          headers: {},
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            alert("Delete user successful.");
            navigate("/users");
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
      <section id="addAmin">
        <div className="box_addAdmin">
          <form>
            <div className="addAdminForm">
              <h2>User Details</h2>
              <div className="del-update">
                <div
                  className="del"
                  onClick={() => {
                    handleDelete(user.id);
                  }}
                >
                  <AiOutlineDelete />
                </div>
              </div>
              <div className="add-box">
                <label htmlFor="fname" className="titlelabel">
                  User ID:
                </label>
                <div className="boxiconnandinput">
                  <LuUser className="iconinput" />
                  <div className="input">
                    <div>{user.id}</div>
                  </div>
                </div>
              </div>
              <div className="add-box">
                <label htmlFor="fname" className="titlelabel">
                  Nick Name:
                </label>
                <div className="boxiconnandinput">
                  <LuUser className="iconinput" />
                  <div className="input">
                    <div>{user.nickname}</div>
                  </div>
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="email" className="titlelabel">
                  Email:
                </label>
                <div className="boxiconnandinput">
                  <MdOutlineEmail className="iconinput" />
                  <div className="input">
                    <div>{user.email}</div>
                  </div>
                </div>
              </div>
              <div className="add-box">
                <label htmlFor="adminImage" className="titlelabel">
                  Profile image:
                </label>
                <div className="BorderinputThenImage">
                  <div className="input">
                    <img
                      src={user.profile_image || profile}
                      alt="admin profile"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default User_details;
