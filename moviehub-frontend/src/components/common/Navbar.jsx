import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Drawer, Dropdown, Space, Avatar, Menu, Grid } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";

const { useBreakpoint } = Grid;

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleLogout = () => {
    logout(); // removes JWT token from localStorage and resets state
    setDrawerVisible(false);
    navigate("/");
  };

  const profileMenu = {
    items: [
      {
        key: "profile",
        label: <Link to="/profile">My Profile</Link>,
        icon: <UserOutlined />,
      },
      {
        key: "dashboard",
        label: (
          <Link to={isAdmin ? "/admin/dashboard" : "/customer/dashboard"}>
            Dashboard
          </Link>
        ),
        icon: <AppstoreOutlined />,
      },
      ...(!isAdmin ? [{
        key: "bookings",
        label: (
          <Link to="/customer/bookings">
            My Bookings
          </Link>
        ),
        icon: <BookOutlined />,
      }] : []),
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ],
  };

  const menuItems = [
    {
      key: "home",
      label: <Link to="/home">Home</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "tickets",
      label: <Link to="/my-tickets">My Tickets</Link>,
      icon: <BookOutlined />,
    },
  ];

  return (
    <div style={{ backgroundColor: "#1f1f1f", padding: "10px 40px", borderBottom: "1px solid #2d2d2d" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Brand Logo on Left */}
        <Link to="/home" style={{ textDecoration: "none" }}>
          <h1 style={{ color: "#F84464", margin: 0, fontWeight: "bold", fontSize: "24px", letterSpacing: "1px" }}>
            MovieHub
          </h1>
        </Link>

        {/* Desktop View Menu Items */}
        {screens.md ? (
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
            
            <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
              <Link to="/home" style={{ color: "#dfdfdf", fontSize: "15px", textDecoration: "none", fontWeight: 500 }}>
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/my-tickets" style={{ color: "#dfdfdf", fontSize: "15px", textDecoration: "none", fontWeight: 500 }}>
                    My Tickets
                  </Link>
                  <Link to="/customer/bookings" style={{ color: "#dfdfdf", fontSize: "15px", textDecoration: "none", fontWeight: 500 }}>
                    My Bookings
                  </Link>
                </>
              )}
            </div>

            {isAuthenticated ? (
              <Dropdown menu={profileMenu} trigger={["click"]} placement="bottomRight">
                <Space style={{ cursor: "pointer" }}>
                  <Avatar style={{ backgroundColor: "#F84464" }} icon={<UserOutlined />} />
                  <span style={{ color: "#ffffff", fontWeight: 500 }}>
                    Hi, {user?.firstName || user?.username}
                  </span>
                </Space>
              </Dropdown>
            ) : (
              <Button
                type="primary"
                style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
                onClick={() => navigate("/")}
              >
                Sign In
              </Button>
            )}
          </div>
        ) : (
          /* Mobile View Burger trigger */
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: "20px", color: "#fff" }} />}
            onClick={() => setDrawerVisible(true)}
            style={{ width: "40px", height: "40px" }}
          />
        )}
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      <Drawer
        title={<span style={{ color: "#F84464", fontWeight: "bold", fontSize: "20px" }}>MovieHub</span>}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ backgroundColor: "#1f1f1f", padding: 0 }}
        headerStyle={{ backgroundColor: "#1f1f1f", borderBottom: "1px solid #303030" }}
      >
        <Menu
          mode="inline"
          theme="dark"
          selectable={false}
          style={{ backgroundColor: "transparent" }}
        >
          <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => setDrawerVisible(false)}>
            <Link to="/home">Home</Link>
          </Menu.Item>
          
          {isAuthenticated && (
            <>
              <Menu.Item key="tickets" icon={<BookOutlined />} onClick={() => setDrawerVisible(false)}>
                <Link to="/my-tickets">My Tickets</Link>
              </Menu.Item>
              <Menu.Item key="bookings" icon={<BookOutlined />} onClick={() => setDrawerVisible(false)}>
                <Link to="/customer/bookings">My Bookings</Link>
              </Menu.Item>
            </>
          )}

          {isAuthenticated ? (
            <>
              <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => setDrawerVisible(false)}>
                <Link to="/profile">My Profile</Link>
              </Menu.Item>
              <Menu.Item key="dashboard" icon={<AppstoreOutlined />} onClick={() => setDrawerVisible(false)}>
                <Link to={isAdmin ? "/admin/dashboard" : "/customer/dashboard"}>
                  Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout} style={{ color: "#ff4d4f" }}>
                Logout
              </Menu.Item>
            </>
          ) : (
            <Menu.Item key="login" icon={<UserOutlined />} onClick={() => setDrawerVisible(false)}>
              <Link to="/">Sign In</Link>
            </Menu.Item>
          )}
        </Menu>
      </Drawer>
    </div>
  );
};

export default Navbar;
