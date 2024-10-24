import React, { useState, useEffect } from "react";
import "./styles/review.css";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Footer from "../components/Footer";
import withReactContent from "sweetalert2-react-content";
import { RotatingLines } from "react-loader-spinner";

function ReviewProduct(id) {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const navigate = useNavigate();
  const product_id = id.id;
  const [product, setProduct] = useState(null);
  const [price, set_price] = useState(null);
  const [count, set_count] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [review, setReview] = useState([]);
  const MySwal = withReactContent(Swal);

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }


  const orderitems = [
    {
      user: user_id,
      items: [
        {
          product: product,
          quantity: count,
          price: price,
        },
      ],
    },
  ];

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
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/store/detail/${product_id}`
        );
        setProduct(response.data);
        set_price(response.data.price);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductDetails();
  }, [product_id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/store/reviews/by-product/${product_id}/user/${user_id}`
        );
        setReview(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (user_id) {
      fetchReviews();
    }
  }, [product_id, user_id]);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();
    let data = JSON.stringify({
      product: product_id,
      user: user_id,
      rating: rating,
      comment: comment,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/review/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        MySwal.fire({
          text: "성공적인 검토.",
          icon: "success",
        });
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });

    setRating(0);
    setComment("");
  };

  return (
    <>
      <Header />
      <div className="contentBody">
        {product ? (
          <div key={product.id}>
            <div className="boxProduct_deteils">
              <React.Fragment>
                <section className="product_details">
                  <div className="product-page-img">
                    <img src={product.image_set[0]} alt="img" />
                  </div>
                </section>
              </React.Fragment>

              <div className="txtContentproduct">
                <h2 className="txt_nameP">제품명: {product.name}</h2>
                <div className="money_txt">
                  가격: $
                  {parseFloat(product.price).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    useGrouping: true,
                  })}
                </div>

                <div className="hr">
                  <hr />
                </div>
                <br />

                {review.length != "" ? (
                  <div className="box_comments">
                    <h4>이미 댓글을 작성하셨습니다..</h4> <br />
                    <div className="txt_review">
                      <div>논평: {review.comment}</div>
                      <div>평가: {review.rating}</div>
                      <div>
                      날짜: {new Date(review.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="box_leave_review">
                    <h4>리뷰를 남겨주세요</h4>
                    <div className="box_container_start">
                      {[...Array(5)].map((_, index) => (
                        <span
                          className="icon_start_review"
                          key={index}
                          style={{
                            fontSize: "30px",
                            cursor: "pointer",
                            color: index < rating ? "#FFD700" : "#DDDDDD",
                          }}
                          onClick={() => handleRatingChange(index + 1)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <form
                      onSubmit={handleSubmitReview}
                      style={{ marginBottom: "20px" }}
                    >
                      <textarea
                        rows="4"
                        cols="50"
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder="여기에 리뷰를 작성하세요..."
                        className="container_textarea"
                      />
                      <br />
                      <button type="submit" className="btn_review">
                      제출하다
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="box_RotatingLines_review">
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
      <Footer />
    </>
  );
}

export default ReviewProduct;
