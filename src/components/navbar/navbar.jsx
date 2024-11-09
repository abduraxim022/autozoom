// Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.scss';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = ({ isOpen }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    navigate('/login'); 
  };

  return (
    <div className={`navbar ${isOpen ? '' : 'collapsed'}`}>
      <div className="admin-section">
        <h3>Admin</h3>
        <IconButton
          color="inherit"
          onClick={handleMenuOpen}
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
