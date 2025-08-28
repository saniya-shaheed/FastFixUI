import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL} from "../apiConfig"
  import "../css/AdminHome.css";

const AdminHome = ({ setIsLoggedIn, setUsername }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      // Make API call to login
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        formData
      );
      console.log('baseUrl:', API_BASE_URL);


      // Show success message
      alert(response.data.message);

      // On successful login, save token and username
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        console.log("Token: ", response.data.token);
        localStorage.setItem("username", response.data.username); // Save username
        setIsLoggedIn(true);
        setUsername(response.data.username);
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (error) {
      // Display error message
      console.log("error-", error.response?.data?.message )
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <section className="adminhome container-fluid p-4  p-sm-5 sign-up ">
      <div className="row justify-content-md-end align-items-center mt-3 ">
        <div className="left-login-content d-none d-md-flex flex-column col-md-6">
          <h2 style={{ color: "#000" }}>Welcome back! </h2>
          <h1 style={{ fontFamily: "Times New Roman" }}>
            Manage and oversee FastFix Auto Maintenance with ease.
          </h1>
        </div>
        <div className="col-12 col-md-6 admin-home-content">
          <div
            className=" pt-md-5 pb-2 pt-4 d-flex mb-xxl-5"
            style={{ borderBottom: "1px solid #fff" }}
          >
            <img
            src={process.env.PUBLIC_URL + '/images/logo2.jpg'}
              alt="logo"
              className="rounded-circle"
            />
            <img src= {process.env.PUBLIC_URL + "/images/fastfix.png"} alt="brandname" />
          </div>
          <div className="d-md-none pt-4 left-content ">
            <h4 style={{ color: "#97bedc" }}>Welcome Back! </h4>
            <h2>Manage and oversee FastFix Auto Maintenance with ease.</h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="pt-3 pt-md-5 pe-2 ps-2 xl-form p-xl-4"
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="form-control "
              value={formData.username}
              onChange={handleChange}
              required
            />
            <div className="pt-2">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {errorMessage && <p>{errorMessage}</p>}
            <div className="pt-3 pt-xl-5 login-button d-flex justify-content-center">
              <button type="submit" className="btn border rounded col-6">
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;
