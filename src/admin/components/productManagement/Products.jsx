import "./product.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "../adminMenu/AdminMenu";
import { BiPlus } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";
import { CiCamera } from "react-icons/ci";
import imageicon from "../../../images/imageicon.jpg";
import banner_no from "../../../images/banner_no.jpg";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Products = () => {
  const [goods_list, set_goods_list] = useState([]);
  const [category_name, set_category_name] = useState("All");
  const [filter, set_filter] = useState(1);
  const [categories, set_categories] = useState([]);
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const [id, set_id] = useState(null);
  const [data, set_data] = useState("");
  const MySwal = withReactContent(Swal);
  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  const [selectedImages, setSelectedImages] = useState(null);
  const [isConfirmationPopupOpenImage, setConfirmationPopupOpenImage] =
    useState(false);
  const [isConfirmationDesc, setConfirmationDesc] = useState(false);
  const [isConfirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [isConfirmationPopupOpenPrice, setConfirmationPopupOpenPrice] =
    useState(false);
  const [isConfirmationQuantity, setConfirmationQuantity] = useState(false);
  const [isConfirmationPopupOpenCategory, setConfirmationPopupOpenCategory] =
    useState(false);
  const [isConfirmationColor, setConfirmationColor] = useState(false);
  const [isPopupName, setPopupName] = useState(false);
  const [isPopupSorted_ID, setPopupSorted_ID] = useState(false);
  const [isPopupImageCategory, setPopupImageCategory] = useState(false);
  const [isPopupimage, setPopupimage] = useState(false);
  const [background_image, set_background_image] = useState(null);
  const [colors, setColors] = useState([]);
  const [data_color, setData_color] = useState([]);
  const [currentColor, setCurrentColor] = useState("");


  console.log("categories......", categories);

  /////////// Category /////////////////
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
        set_categories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  /////////////////////handleDelete Category ////////
  const handleDeleteCategory = (id) => {
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
          url: import.meta.env.VITE_API + `/store/categories/${id}`,
          headers: {},
        };

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            MySwal.fire({
              text: "Successful delete the category.",
              icon: "success",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  ///// Web in fo //////
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
        // console.log(JSON.stringify(response.data));
        set_background_image(response.data[0].banner1);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [background_image]);

  ////// Handle ChangeBackgroundImage ///////
  const ChangeBackgroundImage = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("banner1", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/web-info/create_update`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        MySwal.fire({
          text: "Update image banner successful.",
          icon: "success",
        });
        set_data(null);
        set_id(null);
        setPopupimage(false);
        window.location.reload(false);
      })
      .catch((error) => {
        console.error(error);
        alert("This image file is too large, please choice another image.");
      });
  };

  // Choose Category image ////Choose banner image
  const togglePopupimage = () => {
    setPopupimage(true);
  };
  const togglePopupCancelimage = () => {
    setPopupimage(false);
    set_data(null);
  };

  const togglePopupName = (id) => {
    setPopupName(true);
    set_id(id);
  };
  const togglePopupSorted_ID = (id) => {
    setPopupSorted_ID(true);
    set_id(id);
  };
  
  const togglePopupCancelName = () => {
    setPopupName(false);
    set_id(null);
    set_data(null);
  };
  const togglePopupCancelSorted_ID = () => {
    setPopupSorted_ID(false);
    set_id(null);
    set_data(null);
  };
  const ChangeCategorySorted_ID = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("sorted_ID", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_API + `/store/categories/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        MySwal.fire({
          text: "Category sorted ID has been change.",
          icon: "success",
        });
        set_data(null);
        set_id(null);
        setPopupSorted_ID(false);
      })
      .catch((error) => console.error(error));
  };
  const ChangeCategoryName = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("name", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_API + `/store/categories/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        MySwal.fire({
          text: "Category name has been change.",
          icon: "success",
        });
        set_data(null);
        set_id(null);
        setPopupName(false);
      })
      .catch((error) => console.error(error));
  };

  // Choose banner image
  const togglePopupImageCategory = (id) => {
    setPopupImageCategory(true);
    set_id(id);
  };
  const ChangeCategoryImage = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("image", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_API + `/store/categories/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        MySwal.fire({
          text: "Category image has been change.",
          icon: "success",
        });
        set_data(null);
        set_id(null);
        setPopupImageCategory(false);
      })
      .catch((error) => console.error(error));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    set_data(file);
  };
  ///Choose image handleImageBanner
  const handleImageBanner = (e) => {
    const file = e.target.files[0];
    set_data(file);
  };
  ///Choose image handleImageProductCategory
  const handleImageProductCategory = (e) => {
    const file = e.target.files[0];
    set_data(file);
  };
  const togglePopupCancelImageCategory = () => {
    setPopupImageCategory(false);
    set_id(null);
    set_data(null);
  };

  ////////////////////// All Product /////////////////////
  useEffect(() => {
    let my_url = "";
    if (category_name === "All") {
      my_url = `/store/?store_id=${store_id}`;
    } else {
      my_url = `/store/?category_name=${category_name}&category_type=${filter}`;
    }
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/?store_id=${store_id}`,
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
  }, [goods_list, category_name, filter]);

  //// onClick icon camera product image
  const openConfirmationPopupImage = (id) => {
    set_id(id);
    setConfirmationPopupOpenImage(true);
  };
  const closeConfirmationPopupImage = () => {
    set_data(null);
    set_id(null);
    setConfirmationPopupOpenImage(false);
    setSelectedImages(null);
  };
  const ChangeProductImage = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("images", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/product/update/${id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        MySwal.fire({
          text: "Product image has been change.",
          icon: "success",
        });
        set_data(null);
        set_id(null);
        setConfirmationPopupOpenImage(false);
      })
      .catch((error) => console.error(error));
  };

  /////////////////////handleDelete Product ////////
  const handleDelete = (id) => {
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
        console.log(id);
        let data = JSON.stringify({
          goods_id: id,
        });

        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: import.meta.env.VITE_API + `/store/goods`,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            MySwal.fire({
              text: "Successful delete the product.",
              icon: "success",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  //// onClick icon edit product name
  const openConfirmationPopup = (id) => {
    set_id(id);
    setConfirmationPopupOpen(true);
  };
  const closeConfirmationPopup = () => {
    set_data(null);
    set_id(null);
    setConfirmationPopupOpen(false);
  };
  const ChangeProductName = () => {
    const formdata = new FormData();
    formdata.append("name", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/product/update/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setConfirmationPopupOpen(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product name has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  ///// onClick icon edit product price
  const openConfirmationPopupPrice = (id) => {
    set_id(id);
    setConfirmationPopupOpenPrice(true);
  };
  const closeConfirmationPopupPrice = () => {
    set_data(null);
    set_id(null);
    setConfirmationPopupOpenPrice(false);
  };
  const ChangeProductPrice = () => {
    const formdata = new FormData();
    formdata.append("price", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/product/update/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setConfirmationPopupOpenPrice(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product price has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  ///// onClick icon edit product Desc
  const openConfirmationDesc = (id) => {
    set_id(id);
    setConfirmationDesc(true);
  };
  const closeConfirmationDesc = () => {
    set_data(null);
    set_id(null);
    setConfirmationDesc(false);
  };
  const ChangeProductDesc = () => {
    const formdata = new FormData();
    formdata.append("description", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/product/update/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setConfirmationDesc(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product the menu is set has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  //////  onClick icon edit product Quantity
  const openConfirmationQuantity = (id) => {
    set_id(id);
    setConfirmationQuantity(true);
  };
  const closeConfirmationQuantity = () => {
    set_data(null);
    set_id(null);
    setConfirmationQuantity(false);
  };
  const ChangeProductQuantity = () => {
    const formdata = new FormData();
    formdata.append("quantity", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/product/update/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setConfirmationQuantity(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product quantity has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  ///// onClick icon edit product category
  const openConfirmationPopupCategory = (id) => {
    set_id(id);
    setConfirmationPopupOpenCategory(true);
  };
  const closeConfirmationPopupCategory = () => {
    set_data(null);
    set_id(null);
    setConfirmationPopupOpenCategory(false);
  };
  const ChangeProductCategory = () => {
    const formdata = new FormData();
    formdata.append("category", data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/product/update/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setConfirmationPopupOpenCategory(false);
        set_data(null);
        set_id(null);

        MySwal.fire({
          text: "Product category has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  ///// onClick icon edit product Size
  const openConfirmationColor = (id, colors) => {
    setData_color(colors);
    set_id(id);
    setConfirmationColor(true);
  };
  const closeConfirmationColor = () => {
    setColors([]);
    set_data(null);
    set_id(null);
    setCurrentColor(null);
    setConfirmationColor(false);
  };
  const addColorInput = () => {
    if (currentColor.trim() !== "") {
      setColors([...colors, currentColor]);
      setCurrentColor("");
    }
  };
  const removeColorInput = (index) => {
    const updatedColors = [...colors];
    updatedColors.splice(index, 1);
    setColors(updatedColors);
  };
  useEffect(() => {
    const extractedNames = data_color.map((item) => item.name);
    setColors(extractedNames);
  }, [data_color]);

  const ChangeProductColors = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      colors: colors,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/product/update/${id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setConfirmationColor(false);
        setCurrentColor(null);
        set_data(null);
        set_id(null);
        set_data_array([]);
        MySwal.fire({
          text: "Product colors has been change.",
          icon: "success",
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <AdminMenu />
      <section id="product_admin">
        <div className="container_body_admin_product">
          <div className="productHead_content">
            <h1 className="htxthead">
              <span className="spennofStyleadmin"></span>Products
            </h1>
            <div className="categoryBoxfilers">
              <Link to="/add-category" className="box_add_products">
                <BiPlus id="icon_add_product" />
                <div>Add Category</div>
              </Link>
              <Link to="/addProduct-admin" className="box_add_products">
                <BiPlus id="icon_add_product" />
                <div>Add Products</div>
              </Link>
            </div>
          </div>

          <div className="banner_no_box">
            <div className="banner_no_box_image">
              <div className="img">
                {background_image ? (
                  <img src={background_image} alt="Banner" />
                ) : (
                  <img src={banner_no} alt="Banner" />
                )}
              </div>
            </div>
            {storage.is_admin === true && (
              <div className="edit_image_banner" onClick={togglePopupimage}>
                <CiCamera id="box_icon_camera" />
              </div>
            )}

            {isPopupimage && (
              <form
                className="background_addproductpopup_box"
                onSubmit={ChangeBackgroundImage}
              >
                <div className="hover_addproductpopup_box_image">
                  <div className="box_input_image">
                    <p>Edit banner image</p>
                    <label className="popup_Border_Boximagae">
                      {data ? (
                        <img src={URL.createObjectURL(data)} alt="Banner" />
                      ) : (
                        <img src={imageicon} alt="Banner" />
                      )}
                      <input
                        type="file"
                        id="img"
                        onChange={handleImageBanner}
                        required
                      />
                      <p className="box_choose_image">Choose img</p>
                    </label>
                  </div>
                  <div className="btn_foasdf">
                    <button
                      className="btn_cancel btn_addproducttxt_popup"
                      onClick={togglePopupCancelimage}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn_confirm btn_addproducttxt_popup"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="box_category">
            {storage.is_admin === true
              ? categories.map((category, index) => (
                  <div className="box_contact_category" key={index}>
                    <div className="img">
                      <img src={category.image} alt="img" />
                    </div>
                    <div
                      className="deleteBox_productconotents"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <AiOutlineDelete />
                    </div>
                    <div
                      className="ChooseImage_category"
                      onClick={() => {
                        togglePopupImageCategory(category.id);
                      }}
                    >
                      <CiCamera id="iconCamera_category" />
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <div>{category.sorted_ID}</div>
                      <div
                        className="box_MdOutlineEdit"
                        onClick={() => {
                          togglePopupSorted_ID(category.id);
                        }}
                      >
                        <MdOutlineEdit id="icon_edit_MdOutlineEdit" />
                      </div>
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <div>{category.name}</div>
                      <div
                        className="box_MdOutlineEdit"
                        onClick={() => {
                          togglePopupName(category.id);
                        }}
                      >
                        <MdOutlineEdit id="icon_edit_MdOutlineEdit" />
                      </div>
                    </div>

                  </div>
                ))
              : categories.map((category, index) => (
                  <div className="box_contact_category" key={index}>
                    <div className="img">
                      <img src={category.image} alt="img" />
                    </div>
                    <div className="box_icon_MdOutlineEdit">
                      <p>{category.name}</p>
                    </div>
                  </div>
                ))}
            {}

            {isPopupImageCategory && (
              <form
                className="background_addproductpopup_box"
                onSubmit={ChangeCategoryImage}
              >
                <div className="hover_addproductpopup_box_image">
                  <div className="box_input_image">
                    <p>Edit Category image</p>
                    <label className="popup_Border_Boximagae">
                      {data ? (
                        <img src={URL.createObjectURL(data)} alt="category" />
                      ) : (
                        <img src={imageicon} alt="category" />
                      )}
                      <input
                        type="file"
                        id="img"
                        onChange={handleImageProductCategory}
                        required
                      />
                      <p className="box_choose_image">Choose img</p>
                    </label>
                  </div>
                  <div className="btn_foasdf">
                    <button
                      className="btn_cancel btn_addproducttxt_popup"
                      onClick={togglePopupCancelImageCategory}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn_confirm btn_addproducttxt_popup"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            )}

            {isPopupSorted_ID && (
              <form
                className="background_addproductpopup_box"
                onSubmit={ChangeCategorySorted_ID}
              >
                <div className="hover_addproductpopup_box">
                  <div className="box_input">
                    <p>Edit category sorted ID</p>
                    <input
                      type="text"
                      placeholder="Category sorted ID..."
                      className="input_of_txtAddproduct"
                      value={data}
                      onChange={(e) => {
                        set_data(e.target.value);
                      }}
                    />
                  </div>
                  <div className="btn_foasdf">
                    <button
                      className="btn_cancel btn_addproducttxt_popup"
                      onClick={togglePopupCancelSorted_ID}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn_confirm btn_addproducttxt_popup"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            )}
            {isPopupName && (
              <form
                className="background_addproductpopup_box"
                onSubmit={ChangeCategoryName}
              >
                <div className="hover_addproductpopup_box">
                  <div className="box_input">
                    <p>Edit category name</p>
                    <input
                      type="text"
                      placeholder="Category name..."
                      className="input_of_txtAddproduct"
                      value={data}
                      onChange={(e) => {
                        set_data(e.target.value);
                      }}
                    />
                  </div>
                  <div className="btn_foasdf">
                    <button
                      className="btn_cancel btn_addproducttxt_popup"
                      onClick={togglePopupCancelName}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn_confirm btn_addproducttxt_popup"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div id="container_product_admin">
            <div className="productHead_content">
              <h1 className="htxthead">
                <span className="spennofStyle"></span>All Product
              </h1>
            </div>
            <div className="contentImageProducts">
              {goods_list.map((product, index) => (
                <div className="box_product" key={index}>
                  <div className="box_input-product_img">
                    <div className="box_product_image">
                      {product.images ? (
                        <img src={product.images} alt="Product" />
                      ) : (
                        <img src={imageicon} alt="Product" />
                      )}
                      <input
                        type="file"
                        id={`image-${index}`}
                        onChange={(e) => handleImage(e, index)}
                        required
                      />
                    </div>

                    <div
                      className="Box_delete_product"
                      onClick={() => handleDelete(product.id)}
                    >
                      <AiOutlineDelete id="AiOutlineDelete" />
                    </div>

                    <div
                      className="edit_image_product"
                      onClick={() => openConfirmationPopupImage(product.id)}
                    >
                      <CiCamera id="box_icon_camera_product" />
                    </div>

                    {isConfirmationPopupOpenImage && (
                      <form
                        className="background_addproductpopup_boxs"
                        onSubmit={ChangeProductImage}
                      >
                        <div className="hover_addproductpopup_box_image">
                          <div className="box_input_image">
                            <p>Edit product image</p>
                            <label className="popup_Border_Boximagae">
                              {data ? (
                                <img
                                  src={URL.createObjectURL(data)}
                                  alt="product"
                                />
                              ) : (
                                <img src={imageicon} alt="product" />
                              )}
                              <input
                                type="file"
                                id={`image-${index}`}
                                onChange={(e) => handleImage(e, index)}
                                required
                              />
                              <p className="box_choose_image">Choose img</p>
                            </label>
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationPopupImage}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              type="submit"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="txtOFproduct">
                    <div className="box_icon_MdOutlineEdit">
                      <li>ProductName: {product.name}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => openConfirmationPopup(product.id)}
                      />
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <li>Price: ${product.price}</li>

                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => openConfirmationPopupPrice(product.id)}
                      />
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <li className="Txt_Description">
                        Description: {product.description}
                      </li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => openConfirmationDesc(product.id)}
                      />
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <li>Quantity: {product.quantity}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => openConfirmationQuantity(product.id)}
                      />
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <li>Category: {product.category}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() =>
                          openConfirmationPopupCategory(product.id)
                        }
                      />
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <li>
                        The menu is set:{" "}
                        {product.colors.map((color) => color.name + " ")}
                      </li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() =>
                          openConfirmationColor(product.id, product.colors)
                        }
                      />
                    </div>

                    {isConfirmationPopupOpen && (
                      <div className="background_addproductpopup_boxs">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit product name</p>
                            <input
                              type="text"
                              placeholder="Product name..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationPopup}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductName();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isConfirmationPopupOpenPrice && (
                      <div className="background_addproductpopup_boxs">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit product price</p>
                            <input
                              type="text"
                              placeholder="Product price..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationPopupPrice}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductPrice();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isConfirmationDesc && (
                      <div className="background_addproductpopup_boxs">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit product Desc</p>
                            <input
                              type="text"
                              placeholder="Desc..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationDesc}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductDesc();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isConfirmationQuantity && (
                      <div className="background_addproductpopup_boxs">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit product quantity</p>
                            <input
                              type="text"
                              placeholder="Quantity..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationQuantity}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductQuantity();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isConfirmationPopupOpenCategory && (
                      <div className="background_addproductpopup_boxs">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit category</p>
                            <div className="box2">
                              <select
                                name="category"
                                className="product_category_filter"
                                required
                                onChange={(e) => set_data(e.target.value)}
                              >
                                <option className="inputproduct" value="">
                                  Select category
                                </option>
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationPopupCategory}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductCategory();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isConfirmationColor && (
                      <div className="background_addproductpopup_boxs">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit product color</p>
                            <div className="box_size_container">
                              <div className="box_size_add">
                                {colors.map((color, colorIndex) => (
                                  <div
                                    key={colorIndex}
                                    className="Box_setOrnnot"
                                  >
                                    <div>{color}</div>
                                    <span
                                      onClick={() =>
                                        removeColorInput(colorIndex)
                                      }
                                    >
                                      <MdClose id="icon_MdCloses" />
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="box_size_content">
                                <input
                                  type="text"
                                  placeholder="Add Type of menu set ro not..."
                                  value={currentColor}
                                  onChange={(e) =>
                                    setCurrentColor(e.target.value)
                                  }
                                />
                                <div
                                  className="btn_addsize"
                                  onClick={() => addColorInput()}
                                >
                                  Add
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationColor}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductColors();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* <div className="box_icon_MdOutlineEdit">
                      <li>
                        Type of water:{" "}
                        {product.sizes.map((size) => size.name + " ")}
                      </li>
                      <MdOutlineEdit id="icon_edit" />
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
