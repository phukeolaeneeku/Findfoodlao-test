import "./board.css";
import { IoDocumentText } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Board = () => {
  const token = localStorage.getItem("token");
  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  const [pending, set_pending] = useState(0);
  const [processing, set_processing] = useState(0);
  const [shipped, set_shipped] = useState(0);
  const [delivered, set_delivered] = useState(0);

  const navigate = useNavigate();

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
          navigate("/loginuser");
          return;
        }
      })
      .catch((error) => {
        localStorage.clear();
        console.log(error);
        navigate("/loginuser");
        return;
      });
  }, [token]);

  useEffect(() => {
    NewOrders();
    ProcessingOrders();
    ShippedOrders();
    DeliveredOrders();
  }, []);

  const NewOrders = () => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API +
        `/store/order/pending/?store_id=${store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        set_pending(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ProcessingOrders = () => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/processing/?store_id=${store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        set_processing(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ShippedOrders = () => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/shipped/?store_id=${store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        set_shipped(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DeliveredOrders = () => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/delivered/?store_id=${store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data.count));
        set_delivered(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <section>
        <div className="board">
          <div className="manage-target">
            <div className="manage">
              <div className="containerBox_board">
                <h2>Orders</h2>
                <div className="contentBox_db">
                  <div className="menu-box four">
                    <div>
                      <IoDocumentText className="iconGad gone4" />
                      <div>Pending</div>
                    </div>
                    <h2>{pending}</h2>
                    <Link to="/order/pending" className="txtcol">
                      <p>View More</p>
                    </Link>
                  </div>
                  <div className="menu-box three">
                    <div>
                      <IoDocumentText className="iconGad gone3" />
                      <div>Process</div>
                    </div>
                    <h2>{processing}</h2>
                    <Link to="/order/processing" className="txtcol">
                      <p>View More</p>
                    </Link>
                  </div>
                  <div className="menu-box one">
                    <div>
                      <IoDocumentText className="iconGad gone1" />
                      <div>Shipped</div>
                    </div>
                    <h2>{shipped}</h2>
                    <Link to="/order/shipped" className="txtcol">
                      <p>View More</p>
                    </Link>
                  </div>
                  <div className="menu-box two">
                    <div>
                      <IoDocumentText className="iconGad gone2" />
                      <div> Delivered</div>
                    </div>
                    <h2>{delivered}</h2>
                    <Link to="/order/delivered" className="txtcol">
                      <p>View More</p>
                    </Link>
                  </div>
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Board;
