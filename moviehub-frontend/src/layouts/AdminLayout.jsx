import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Space, Avatar, Dropdown } from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  HomeOutlined,
  DesktopOutlined,
  CalendarOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";

const { Header, Sider, Content, Footer } = Layout;

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "/admin/movies",
      icon: <VideoCameraOutlined />,
      label: <Link to="/admin/movies">Movies</Link>,
    },
    {
      key: "/admin/theatres",
      icon: <HomeOutlined />,
      label: <Link to="/admin/theatres">Theatres</Link>,
    },
    {
      key: "/admin/screens",
      icon: <DesktopOutlined />,
      label: <Link to="/admin/screens">Screens</Link>,
    },
    {
      key: "/admin/shows",
      icon: <CalendarOutlined />,
      label: <Link to="/admin/shows">Shows</Link>,
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: "/admin/bookings",
      icon: <BookOutlined />,
      label: <Link to="/admin/bookings">Bookings</Link>,
    },
  ];

  const profileMenu = {
    items: [
      {
        key: "home",
        label: <Link to="/home">Go to Storefront</Link>,
        icon: <HomeOutlined />,
      },
      {
        key: "logout",
        label: "Logout",
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar Sider */}
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" style={{ borderRight: "1px solid #303030" }}>
        <div style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #303030" }}>
          <h2 style={{ color: "#F84464", margin: 0, fontSize: collapsed ? "16px" : "20px", fontWeight: "bold" }}>
            {collapsed ? "MH" : "MovieHub"}
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ paddingTop: "15px" }}
        />
      </Sider>

      {/* Main Layout wrapper */}
      <Layout>
        <Header style={{ padding: "0 24px", background: "#1f1f1f", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #303030" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64, color: "#fff" }}
          />

          <Dropdown menu={profileMenu} placement="bottomRight" trigger={["click"]}>
            <Space style={{ cursor: "pointer" }}>
              <Avatar style={{ backgroundColor: "#F84464" }} icon={<UserOutlined />} />
              <span style={{ color: "#fff" }}>Admin ({user?.username})</span>
            </Space>
          </Dropdown>
        </Header>

        {/* Content Outlet */}
        <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280, background: "#141414", borderRadius: "8px", overflow: "initial" }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center", background: "#141414", borderTop: "1px solid #303030", padding: "15px 0", color: "#8c8c8c" }}>
          MovieHub Admin Panel © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
