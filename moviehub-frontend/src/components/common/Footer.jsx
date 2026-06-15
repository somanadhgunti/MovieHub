import React from "react";
import { Layout, Row, Col, Space } from "antd";
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, YoutubeOutlined } from "@ant-design/icons";

const { Footer: AntFooter } = Layout;

export const Footer = () => {
  return (
    <AntFooter style={{ backgroundColor: "#1a1a1a", color: "#8c8c8c", padding: "40px 20px", borderTop: "1px solid #2d2d2d" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Support Section */}
        <Row justify="space-between" align="middle" style={{ borderBottom: "1px solid #2d2d2d", paddingBottom: "20px", marginBottom: "20px" }}>
          <Col>
            <span style={{ fontSize: "16px", fontWeight: "bold", color: "#dfdfdf" }}>
              Got a question? We're here to help you 24/7!
            </span>
          </Col>
          <Col>
            <Space size="large">
              <span>Customer Support: 1800-123-4567</span>
              <span>Email: support@moviehub.com</span>
            </Space>
          </Col>
        </Row>

        {/* Links Section */}
        <Row gutter={[32, 16]}>
          <Col xs={24} sm={12} md={6}>
            <h4 style={{ color: "#dfdfdf", marginBottom: "15px" }}>Trending Movies</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Now Showing</li>
              <li>Coming Soon</li>
              <li>Cinemas Near Me</li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h4 style={{ color: "#dfdfdf", marginBottom: "15px" }}>Booking Support</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Online Booking Guide</li>
              <li>Cancellation & Refund Policy</li>
              <li>FAQs</li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h4 style={{ color: "#dfdfdf", marginBottom: "15px" }}>Corporate</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>About Us</li>
              <li>Careers</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <h4 style={{ color: "#dfdfdf", marginBottom: "15px" }}>Connect With Us</h4>
            <Space size="middle" style={{ fontSize: "24px" }}>
              <FacebookOutlined style={{ cursor: "pointer", hover: { color: "#F84464" } }} />
              <TwitterOutlined style={{ cursor: "pointer" }} />
              <InstagramOutlined style={{ cursor: "pointer" }} />
              <YoutubeOutlined style={{ cursor: "pointer" }} />
            </Space>
          </Col>
        </Row>

        {/* Brand and Copyright */}
        <div style={{ textAlign: "center", marginTop: "40px", fontSize: "12px", borderTop: "1px solid #2d2d2d", paddingTop: "20px" }}>
          <p style={{ margin: 0 }}>
            Copyright © {new Date().getFullYear()} MovieHub Ltd. All Rights Reserved.
          </p>
          <p style={{ margin: "5px 0 0 0", color: "#595959" }}>
            The content and images used on this site are copyright protected and copyrights vests with the respective owners.
          </p>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
