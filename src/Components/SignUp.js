import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/AdminHome.css";
import { API_BASE_URL } from "../apiConfig";

const SignUp = ({ setIsLoggedIn, setUsername }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
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

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      // Make API call to register
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        formData
      );

      alert("Signed up successfully, please visit the login page.");
      navigate("/adminFF"); // Redirect to login
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <section className="adminhome container-fluid p-4  p-sm-5 sign-up ">
      <div className="row justify-content-md-end align-items-center mt-3 ">
        <div className="left-content d-none d-md-flex flex-column col-md-6">
          <h2 style={{ color: "#000" }}>
            Are you ready to work with FastFix?{" "}
          </h2>
          <h1 style={{ fontFamily: "Times New Roman" }}>Sign up here.</h1>
        </div>
        <div className="col-12 col-md-6 admin-home-content">
          <div
            className=" pt-md-5 pb-2 pt-4 d-flex"
            style={{ borderBottom: "1px solid #fff" }}
          >
            <img
            src={process.env.PUBLIC_URL + '/images/logo2.jpg'}
              alt="logo"
              className="rounded-circle"
            />
            
            <img
            src={process.env.PUBLIC_URL + '/images/fastfix.png'} alt="brandname" />
          </div>
          <div className="d-md-none pt-4 left-content">
            <h4 style={{ color: "#97bedc" }}>
              Are you ready to work with FastFix?{" "}
            </h4>
            <h2>Sign up here.</h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="pt-3 pt-md-5 pe-2 ps-2 xl-form p-xl-4"
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="form-control"
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
            <div className="pt-2">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {errorMessage && <p>{errorMessage}</p>}
            <div className="pt-3 pt-xl-5 login-button d-flex justify-content-center">
              <button type="submit" className="btn border rounded col-6">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
