import React, { useState, useEffect } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import "./addProduct.css";
import imageicon from "../../../images/imageicon.jpg";
import { AiOutlineDelete } from "react-icons/ai";
import { CiCamera } from "react-icons/ci";
import {
  HiOutlineShoppingBag as HiMiniShoppingBag,
  HiPlus,
} from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AddProduct = () => {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const navigate = useNavigate();
  const [categories, set_categories] = useState([]);
  var store_id = null;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  const vv = "not";
  var cc = null;
  if (vv == "set") {
    cc = 2;
  } else {
    cc = 0;
  }

  const [products, setProducts] = useState([
    {
      name: "",
      description: "",
      price: "",
      category: "",
      quantity: "",
      sizes: [],
      colors: [""],
      images: [],
      imagePreview: "",
    },
  ]);
  const MySwal = withReactContent(Swal);

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
        // console.log(response.data);
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
        // console.log(JSON.stringify(response.data));
        set_categories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleProductName = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].name = value;
    setProducts(updatedProducts);
  };

  const handleProductDescription = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].description = value;
    setProducts(updatedProducts);
  };

  const handleColorSelection = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].colors = value === "set" ? ["set"] : ["not"];
    setProducts(updatedProducts);
  };

  const handleProductCategory = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].category = value;
    setProducts(updatedProducts);
  };

  const handleProductPrice = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].price = value;
    setProducts(updatedProducts);
  };

  const handleProductQuantity = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].quantity = value;
    setProducts(updatedProducts);
  };

  const handleImage = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProducts = [...products];
        updatedProducts[index].images.push(reader.result);
        updatedProducts[index].imagePreview = reader.result;
        setProducts(updatedProducts);
      };
      reader.onerror = () => {
        console.error("Error reading the file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setProducts([
      ...products,
      {
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
        sizes: [],
        colors: [""],
        images: [],
        imagePreview: "",
      },
    ]);
  };
  ////////////////// handleDelete Product /////////////////
  const handleDelete = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };
  /////////////// handleSubmit //////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const product of products) {
      if (product.name.trim() === "") {
        Swal.fire({
          text: "Please enter a product name!",
          icon: "question",
        });
        return;
      }
    }
    for (const product of products) {
      if (product.price.trim() === "") {
        Swal.fire({
          text: "Please enter a product price!",
          icon: "question",
        });
        return;
      }
    }
    if (
      !products.every(
        (product) => product.colors.length > 0 && product.colors[0] !== ""
      )
    ) {
      Swal.fire({
        text: "Please enter a choose set or not!",
        icon: "question",
      });
      return;
    }
    for (const product of products) {
      if (product.category.trim() === "") {
        Swal.fire({
          text: "Please enter a choose category!",
          icon: "question",
        });
        return;
      }
    }
    for (const product of products) {
      if (product.quantity.trim() === "") {
        Swal.fire({
          text: "Please enter a  quantity!",
          icon: "question",
        });
        return;
      }
    }
    for (const product of products) {
      if (product.imagePreview.trim() === "") {
        Swal.fire({
          text: "Please choose image!",
          icon: "question",
        });
        return;
      }
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_API + `/store/${storage.store_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goods_set: products,
          }),
        }
      );

      if (!response.ok) {
        Swal.fire({
          text: "Add product failed.",
          icon: "question",
        });
        console.log(response);
        throw new Error("Add product failed.");
      }

      const responseData = await response.json();
      Swal.fire({
        text: "Product addition has been completed.",
        icon: "success",
      });
      window.location.reload(false);
    } catch (error) {
      console.error("Add product error:", error.message);
      Swal.fire({
        text: `Error: ${error.message}`,
        icon: "error",
      });
    }
  };

  /////////////////// Add type of water ////////////////////
  // const handleSizeInputChange = (e, index) => {
  //   const { value } = e.target;
  //   const updatedProducts = [...products];
  //   updatedProducts[index].currentsizes = value;
  //   setProducts(updatedProducts);
  // };
  // const addSizeInput = (index) => {
  //   const updatedProducts = [...products];
  //   if (updatedProducts[index].currentsizes.trim() !== "") {
  //     updatedProducts[index].sizes.push(updatedProducts[index].currentsizes);
  //     updatedProducts[index].currentsizes = "";
  //     setProducts(updatedProducts);
  //   }
  // };
  // const removeSizeInput = (productIndex, sizeIndex) => {
  //   const updatedProducts = [...products];
  //   updatedProducts[productIndex].sizes.splice(sizeIndex, 1);
  //   setProducts(updatedProducts);
  // };

  return (
    <>
      <AdminMenu />
      <section id="post">
        <div className="boxcontainerSpan_Box"></div>
        <div className="box_container_product">
          <div className="Box_btn_haed">
            <h2>Add Product</h2>
            <div className="btn_submit">
              <button type="submit" onClick={handleSubmit}>
                Post Product
              </button>
            </div>
          </div>

          <div className="group_container_product">
            {products.map((product, index) => (
              <div key={index}>
                <div className="addProduct_box_content_afterThat">
                  <div
                    className="deleteBox_productconotent"
                    onClick={() => handleDelete(index)}
                  >
                    <AiOutlineDelete />
                  </div>
                  <div className="box_input-img">
                    {product.imagePreview ? (
                      <img src={product.imagePreview} alt="product" />
                    ) : (
                      <img src={imageicon} alt="default" />
                    )}
                    <input
                      type="file"
                      id={`img-${index}`}
                      required
                      onChange={(e) => handleImage(e, index)}
                    />
                  </div>

                  <div className="edit_images">
                    <label
                      htmlFor={`img-${index}`}
                      className="trigger_popup_fricc"
                    >
                      <CiCamera id="icon_ci_camera" />
                    </label>
                  </div>

                  <div className="box_container_image">
                    <div className="input-box">
                      <div className="box">
                        <input
                          type="text"
                          placeholder="Product name..."
                          value={product.name}
                          onChange={(e) => handleProductName(e, index)}
                        />
                      </div>

                      <div className="box">
                        <input
                          type="text"
                          placeholder="Price..."
                          value={product.price}
                          onChange={(e) => handleProductPrice(e, index)}
                        />
                      </div>

                      <div className="box">
                        <input
                          type="text"
                          placeholder="Description..."
                          value={product.description}
                          onChange={(e) => handleProductDescription(e, index)}
                        />
                      </div>

                      <div className="box">
                        <input
                          type="text"
                          placeholder="Quantity..."
                          value={product.quantity}
                          onChange={(e) => handleProductQuantity(e, index)}
                          required
                        />
                      </div>

                      <div className="box">
                        <select
                          name="category"
                          className="product_category"
                          onChange={(e) => handleColorSelection(e, index)}
                        >
                          <option value="">Select set or not</option>
                          <option value="set">Set</option>
                          <option value="not">Not</option>
                        </select>
                      </div>

                      <div className="box">
                        <select
                          name="category"
                          className="product_category"
                          onChange={(e) => handleProductCategory(e, index)}
                          required
                        >
                          <option className="inputproduct" value="1">
                            Select category
                          </option>
                          {categories.map((item) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* <div className="box_size_product_container">
                        <div className="box_size_add">
                          {product.sizes.map((size, sizeIndex) => (
                            <div key={sizeIndex} className="box_size_add_item">
                              <div>{size}</div>
                              <span
                                onClick={() =>
                                  removeSizeInput(index, sizeIndex)
                                }
                              >
                                <MdClose id="icon_MdClose" />
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="box_size_content">
                          <input
                            type="text"
                            placeholder="Add Type of water..."
                            value={product.currentsizes || ""}
                            onChange={(e) => handleSizeInputChange(e, index)}
                          />
                          <div
                            className="btn_addsize"
                            onClick={() => addSizeInput(index)}
                          >
                            Add
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div onClick={handleAdd}>
              <div className="iconimage">
                <HiMiniShoppingBag id="icon_shoppingbag" />
                <HiPlus id="icon_goplus" />
              </div>
            </div>

            <div className="btn_submit_Mobile">
              <button type="submit" onClick={handleSubmit}>
                Post Product
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddProduct;
