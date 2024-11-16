import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import StoreIcon from "@mui/icons-material/Store";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MenuIcon from "@mui/icons-material/Menu";
import { BiCategoryAlt } from "react-icons/bi";
import { CgAdidas } from "react-icons/cg";
import { IoLocationOutline } from "react-icons/io5";
import { PiCity } from "react-icons/pi";
import { FcElectricity } from "react-icons/fc";
import { IoCarSportOutline } from "react-icons/io5";
import "./sidebar.scss";

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Categories", icon: <BiCategoryAlt/>, path: "/categories" },
    { text: "Brands", icon: <CgAdidas/>, path: "/brands" },
    { text: "Models", icon: <FcElectricity/>, path: "/models" },
    { text: "Locations", icon: <IoLocationOutline/>, path: "/locations" },
    { text: "Cities", icon: <PiCity/>, path: "/cities" },
    { text: "Cars", icon: <IoCarSportOutline/>, path: "/cars" },
  ];

  return (
    <div className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      <IconButton onClick={onToggle} className="sidebar-toggle-button">
        <MenuIcon />
      </IconButton>
      <List className="sidebar-menu-list">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              className={`sidebar-menu-button ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <ListItemIcon
                style={{ color: "#fff" }}
                className="sidebar-menu-icon"
              >
                {item.icon}
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary={item.text}
                  className="sidebar-menu-text"
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
