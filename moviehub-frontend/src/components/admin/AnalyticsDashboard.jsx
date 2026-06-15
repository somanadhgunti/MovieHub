import React from "react";
import { Row, Col, Card, Statistic, Progress } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, BookOutlined, InteractionOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { formatCurrency } from "../../utils/dateUtils";

export const AnalyticsDashboard = ({ data = {} }) => {
  const stats = [
    {
      title: "Total Revenue",
      value: data.totalRevenue || 148500,
      formatter: (val) => formatCurrency(val),
      icon: <DollarOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
      desc: "12% increase from last month",
      trend: "up",
    },
    {
      title: "Total Bookings",
      value: data.totalBookings || 842,
      icon: <BookOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
      desc: "4% increase from last week",
      trend: "up",
    },
    {
      title: "Active Seat Locks",
      value: data.activeSeatLocks || 12,
      icon: <InteractionOutlined style={{ fontSize: "24px", color: "#faad14" }} />,
      desc: "Real-time locked seats",
      trend: "neutral",
    },
    {
      title: "Active Movies",
      value: data.activeMovies || 24,
      icon: <VideoCameraOutlined style={{ fontSize: "24px", color: "#F84464" }} />,
      desc: "Currently Now Showing",
      trend: "neutral",
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        {stats.map((stat, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Statistic
                  title={<span style={{ color: "#8c8c8c" }}>{stat.title}</span>}
                  value={stat.value}
                  formatter={stat.formatter}
                  valueStyle={{ color: "#ffffff", fontWeight: "bold" }}
                />
                <div style={{ background: "#141414", padding: "10px", borderRadius: "8px" }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ marginTop: "12px", fontSize: "12px" }}>
                {stat.trend === "up" && <ArrowUpOutlined style={{ color: "#52c41a", marginRight: "4px" }} />}
                {stat.trend === "down" && <ArrowDownOutlined style={{ color: "#f5222d", marginRight: "4px" }} />}
                <span style={{ color: stat.trend === "up" ? "#52c41a" : stat.trend === "down" ? "#f5222d" : "#8c8c8c" }}>
                  {stat.desc}
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col xs={24} md={12}>
          <Card title={<span style={{ color: "#fff" }}>Seat Occupancy Ratio</span>} style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030" }}>
            <div style={{ display: "flex", justifyContent: "space-around", padding: "20px 0" }}>
              <div style={{ textAlign: "center" }}>
                <Progress type="circle" percent={72} strokeColor="#F84464" trailColor="#303030" />
                <div style={{ color: "#fff", marginTop: "10px" }}>IMAX Screens</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <Progress type="circle" percent={54} strokeColor="#1890ff" trailColor="#303030" />
                <div style={{ color: "#fff", marginTop: "10px" }}>Standard Screens</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={<span style={{ color: "#fff" }}>Revenue Target Achievement</span>} style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030" }}>
            <div style={{ padding: "10px 0" }}>
              <div style={{ color: "#8c8c8c", marginBottom: "5px" }}>Monthly Target (₹5,00,000)</div>
              <Progress percent={85} status="active" strokeColor="#52c41a" trailColor="#303030" />
              
              <div style={{ color: "#8c8c8c", marginTop: "20px", marginBottom: "5px" }}>Quarterly Target (₹15,00,000)</div>
              <Progress percent={60} status="active" strokeColor="#faad14" trailColor="#303030" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;
