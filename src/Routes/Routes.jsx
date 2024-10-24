import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Details from "../pages/Details";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Order from "../pages/Order";
import Bill from "../components/Bill";
import Login from "../components/Login";
import Register from "../components/Register";
import ForgotPassword from "../components/ForgotPassword";
import Search from "../components/Search";
import Profile from "../pages/Profile";

////// Admin_Dashboard ///////
import Dashboard from "../admin/Dashboard";
import Hotel from "../admin/components/hotelManagement/Hotel";
import AddHotel from "../admin/components/hotelManagement/AddHotel";
import EditHotel from "../admin/components/hotelManagement/EditHotel";
import WebInfo from "../admin/components/InfoManagement/WebInfo";
import AddInfo from "../admin/components/InfoManagement/AddInfo";
import EditInfo from "../admin/components/InfoManagement/EditInfo";
import Bank from "../admin/components/bankManagement/Bank";
import AddBank from "../admin/components/bankManagement/AddBank";
import Currency from "../admin/components/currency/Currency";
import User from "../admin/components/userManagement/User";
import User_details from "../admin/components/userManagement/User_details";
import Products from "../admin/components/productManagement/Products";
import AddCategory from "../admin/components/productManagement/Addcategory";
import AddProduct from "../admin/components/productManagement/AddProduct";
import OrderPending from "../admin/components/ordermanagement/OrderPending";
import OrderProcess from "../admin/components/ordermanagement/OrderProcess";
import OrderShipped from "../admin/components/ordermanagement/OrderShipped";
import OrderDelivered from "../admin/components/ordermanagement/OrderDelivered";
import OrderBill from "../admin/components/ordermanagement/OrderBill";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/hotel/:hotelName/room_number/:room_number/address/:address"
          element={<Home />}
        />
        <Route path="/details/:id" element={<Details />} />
        <Route
          path="/hotel/:hotelName/room_number/:room_number/address/:address/details/:id"
          element={<Details />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/hotel/:hotelName/room_number/:room_number/address/:address/cart"
          element={<Cart />}
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/hotel/:hotelName/room_number/:room_number/address/:address/checkout"
          element={<Checkout />}
        />
        <Route path="/order" element={<Order />} />
        <Route
          path="/hotel/:hotelName/room_number/:room_number/address/:address/order"
          element={<Order />}
        />
        <Route path="/bill/:bill_id" element={<Bill />} />
        <Route
          path="/hotel/:hotelName/room_number/:room_number/address/:address/bill/:bill_id"
          element={<Bill />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/hotel/:hotelName/room_number/:room_number/address/:address/login"
          element={<Login />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/find-password" element={<ForgotPassword />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/hotel/:hotelName/room_number/:room_number/address/:address/search"
          element={<Search />}
        />
           <Route path="/profile" element={<Profile />} />

        {/* --------- Admin ---------- */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/add-hotel" element={<AddHotel />} />
        <Route path="/edit-hotel/:id" element={<EditHotel />} />
        <Route path="/info" element={<WebInfo />} />
        <Route path="/add-info" element={<AddInfo />} />
        <Route path="/edit-info" element={<EditInfo />} />
        <Route path="/bank-account" element={<Bank />} />
        <Route path="/add-account" element={<AddBank />} />
        <Route path="/currency" element={<Currency />} />
        <Route path="/users" element={<User />} />
        <Route path="/user_details/:id" element={<User_details />} />
        <Route path="/product-admin" element={<Products />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/addProduct-admin" element={<AddProduct />} />
        <Route path="/order/pending" element={<OrderPending />} />
        <Route path="/order/processing" element={<OrderProcess />} />
        <Route path="/order/shipped" element={<OrderShipped />} />
        <Route path="/order/delivered" element={<OrderDelivered />} />
        <Route path="/orderbill-admin/:bill_id" element={<OrderBill />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
