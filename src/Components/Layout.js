import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ username, children }) => {
  return (
    <section className="layout">
      {/* Pass username to Navbar */}
      <Navbar username={username} />
      <div className="d-md-flex flex-md-row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className=" col-lg-10 ">
          <div className="content ">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default Layout;
