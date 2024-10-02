import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons';

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        const first_name = localStorage.getItem('first_name');
        const last_name = localStorage.getItem('last_name');
        setUserData({ first_name, last_name });
      }
      setLoading(false);
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    setUserData(null);
    window.location.href = '/';
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <UserOutlined /> Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Button type="link" onClick={handleLogout}>
          <LogoutOutlined /> Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="navbar">
    <div className="navbar-logo">
      <Link to="/profile" style={{ textDecoration: 'none', color: '#ffff' }}>
        <h1>GoFinance</h1>
      </Link>
    </div>
      <div className="navbar-links">
        {token && (
          <Link to="/transactions" className="navbar-link">
            Transactions
          </Link>
        )}
      </div>
      
      <div className="navbar-user">
        <Button className="navbar-toggle" onClick={() => setMenuVisible(!menuVisible)}>
          <MenuOutlined />
        </Button>
        {token && userData ? (
          <>
            <div className="desktop-dropdown">
              <Dropdown overlay={menu} trigger={['click']}>
                <Button className="user-button">
                  <UserOutlined />
                  Hello, {userData.first_name} {userData.last_name} <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>

      {menuVisible && token && userData && (
        <div className="mobile-menu">
          <Dropdown overlay={menu} trigger={['click']} visible>
            <Button className="user-button">
              <UserOutlined />
              Hello, {userData.first_name} {userData.last_name}
            </Button>
          </Dropdown>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
