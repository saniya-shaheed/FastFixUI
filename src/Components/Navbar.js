import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens from local storage
    localStorage.removeItem("authToken"); // Example token key
    navigate("/adminFF");
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid px-0">
        <div className="align-md d-block d-md-flex w-100 col-12 ">
          <a className="navbar-brand col-12 col-md-6" href="#">
            <img
            src={process.env.PUBLIC_URL + '/images/logo-navbar.jpg'}
              alt="brand"
              className="ps-4 d-inline-block align-text-top image-logo"
            />
            <img
              src={process.env.PUBLIC_URL + '/images/fastfix.png'}
              alt="brandname"
              className="d-inline-block align-text-top image-name"
            />
          </a>

          <div className="col-12 col-md-5 greeting d-flex pe-md-4">
            <div className="p-2 pe-xl-3">
              {username && (
                <span>
                  Hello, <b>{username}</b>
                </span>
              )}
            </div>
            <div className="notification-logout d-flex align-items-xl-center">
              <div className="p-2 pe-xl-3 position-relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  style={{ fill: "#fff" }}
                  className="notification-icon"
                  onClick={() => navigate("/notifications")}
                >
                  <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                </svg>
              </div>
              <div className="p-2 ">
                <button onClick={handleLogout} className="btn logout-btn">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
