import React, { useState, useEffect } from "react";
import "./styles/banner.css";
import axios from "axios";

function Banner() {
  const [background_image, set_background_image] = useState(null);
  const [slides, setSlides] = useState([background_image]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState("right");

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_background_image(response.data[0].banner1);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [background_image]);

  const handlePrevSlide = () => {
    setDirection("left");
    setActiveSlide(activeSlide === 0 ? slides.length - 1 : activeSlide - 1);
  };

  const handleNextSlide = () => {
    setDirection("right");
    setActiveSlide(activeSlide === slides.length - 1 ? 0 : activeSlide + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <div className="banner">
      <div className="banner-content">
        <img src={background_image} alt="banner" />
      </div>

      <div className="but1_banner">
        <div className="nav-btn_banner " onClick={handlePrevSlide}>
          &#8249;
        </div>
      </div>
      <div className="but2_banner">
        <div className="nav-btn_banner " onClick={handleNextSlide}>
          &#8250;
        </div>
      </div>
    </div>
  );
}

export default Banner;
