import { useState, useEffect } from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");
  const [search, setSearch] = useState(searchParam || "");

  const [goods_list, set_goods_list] = useState([]);
  const [filter, set_filter] = useState(1);
  const [category_list, set_category_list] = useState([]);
  const [category_name, set_category_name] = useState(""); // Fix: initialized with empty string
  const { hotelName, room_number, address } = useParams();

  useEffect(() => {
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParam]);

  /////////// Categories ////////////
  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/categories",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_category_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    set_category_name(categoryName);
    setSearch("");
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("search");
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  /////////// Products ////////////
  useEffect(() => {
    let my_url = "";
    if (category_name !== "") {
      my_url = `/store/?category_name=${category_name}&category_type=${category_name}`;
    } else {
      my_url = `/store/?category_type=${category_name}`;
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + my_url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_goods_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category_name]);

  /////////// Search /////////////
  if (!search == "") {
    useEffect(() => {
      let data = JSON.stringify({
        search: search,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_API + "/store/search",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          set_goods_list(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  } else {
    useEffect(() => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_API + `/store/?category_type=${filter}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .request(config)
        .then((response) => {
          set_goods_list(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [filter]);
  }

  /////////// StarAVG ////////////
  function StarAVG(value) {
    let star_avg = (value / 5) * 100;
    if (star_avg === 0) {
      star_avg = 100;
    }
    return star_avg;
  }

  return (
    <>
      <div className="container">
        <Header set_category_name={set_category_name} />
        <Banner />
        <div className="category-section">
          {category_list.map((category, index) => (
            <div key={index} className="category-item">
              <div
                className="category-item"
                value={category.name}
                onClick={() => handleCategoryClick(category.name)}
              >
                <img src={category.image} alt={category.name} />
                <span>{category.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="product-section">
          <h2>제품</h2>
          <div className="product-grid">
            {goods_list.map((product, index) => (
              <div className="product-card" key={index}>
                <Link
                  to={
                    hotelName && room_number && address
                      ? `/hotel/${hotelName}/room_number/${room_number}/address/${address}/details/${product.id}`
                      : `/details/${product.id}`
                  }
                >
                  <img src={product.images} alt="image" />
                  <div className="star-rating">
                    <div className="stars-outer">
                      <div
                        className="stars-inner"
                        style={{ width: `${StarAVG(product.star_avg)}%` }}
                      ></div>
                    </div>
                  </div>
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-price">${product.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Search;
