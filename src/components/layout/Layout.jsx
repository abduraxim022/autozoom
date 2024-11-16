import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/Sidebar";
import "./layout.scss";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout-container">
      <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />
      <div
        className="layout-content"
      >
        <Navbar isSidebarOpen={isSidebarOpen} />
        <div className="navbar-spacing">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
