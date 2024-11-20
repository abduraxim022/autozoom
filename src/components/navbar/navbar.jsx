import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.scss';
import { Dropdown, Menu, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Navbar = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={`navbar ${isOpen ? '' : 'collapsed'}`}>
      <div className="admin-section">
        <Dropdown overlay={menu} trigger={['hover']} placement="bottomRight">
          <Button icon={<UserOutlined />} type="text">
            <span className="admin-text">Admin</span>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
