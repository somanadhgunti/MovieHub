import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const { Content } = Layout;

export const UserLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#141414" }}>
      <Header />
      <Content style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", margin: "0 auto", backgroundColor: "#141414" }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default UserLayout;
