import React, { useEffect, useState } from "react";
import { Typography, Table, Card, Tag, Alert, Empty, Row, Col, Statistic, Progress, Spin } from "antd";
import { LoadingOutlined, DollarOutlined, BookOutlined, CalendarOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { formatCurrency, formatDate, formatTime } from "../utils/dateUtils";
import { getAllBookings, resolveBookings } from "../services/bookingService";
import { getAllShows } from "../services/showService";

const { Title, Text } = Typography;

export const TheatreOwnerDashboard = () => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [totalShows, setTotalShows] = useState(0);
  const [activeShows, setActiveShows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnerDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch shows to calculate total and active
        const showsData = await getAllShows();
        const showsList = showsData.content || showsData || [];
        setTotalShows(showsList.length);

        // Active shows are shows scheduled for today or future dates
        const todayStr = new Date().toISOString().split("T")[0];
        const active = showsList.filter(s => s.showDate >= todayStr).length;
        setActiveShows(active);

        // 2. Fetch all bookings
        const bookingsData = await getAllBookings();
        const resolved = await resolveBookings(bookingsData);
        setRecentBookings(resolved || []);
      } catch (err) {
        console.error("Failed to load owner dashboard statistics:", err);
        setError("Failed to query transaction log registers from the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerDashboardData();
  }, []);

  const columns = [
    {
      title: "Booking Ref",
      dataIndex: "bookingNumber",
      key: "bookingNumber",
      render: (text) => <span style={{ fontFamily: "monospace", color: "#fff" }}>{text}</span>
    },
    {
      title: "Movie Title",
      dataIndex: "movieTitle",
      key: "movieTitle",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>
    },
    {
      title: "Cinema Screen",
      dataIndex: "theatreName",
      key: "theatreName",
      render: (text, record) => <span>{text} | Screen {record.screenNumber || 1}</span>
    },
    {
      title: "Seats Count",
      dataIndex: "totalSeats",
      key: "totalSeats",
      align: "center"
    },
    {
      title: "Amount Paid",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val) => <span style={{ color: "#52c41a", fontWeight: "bold" }}>{formatCurrency(val)}</span>
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => (
        <Tag color={status === "CONFIRMED" ? "green" : "red"}>
          {status}
        </Tag>
      )
    },
    {
      title: "Show Time",
      dataIndex: "showDate",
      key: "showDate",
      render: (date, record) => <span>{formatDate(date)} {formatTime(record.showTime)}</span>
    }
  ];

  const totalRevenue = recentBookings
    .filter(b => b.bookingStatus === "CONFIRMED")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const stats = [
    {
      title: "Total Shows",
      value: totalShows,
      icon: <CalendarOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
    },
    {
      title: "Active Shows",
      value: activeShows,
      icon: <PlayCircleOutlined style={{ fontSize: "24px", color: "#faad14" }} />,
    },
    {
      title: "Total Bookings",
      value: recentBookings.length,
      icon: <BookOutlined style={{ fontSize: "24px", color: "#F84464" }} />,
    },
    {
      title: "Revenue",
      value: totalRevenue,
      formatter: (val) => formatCurrency(val),
      icon: <DollarOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
    },
  ];

  if (error) {
    return (
      <div style={{ color: "#ffffff", padding: "20px" }}>
        <Alert message="Connection Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ color: "#ffffff" }}>
      
      <Title level={2} style={{ color: "#ffffff", marginBottom: "25px", fontWeight: "bold" }}>
        Theatre Owner Dashboard
      </Title>

      {/* Stats Cards */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: "#F84464" }} spin />} />
        </div>
      ) : (
        <>
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
                </Card>
              </Col>
            ))}
          </Row>

          {/* Occupancy and achievement */}
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            <Col xs={24} md={12}>
              <Card title={<span style={{ color: "#fff" }}>Lounge Occupancy Ratio</span>} style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030" }}>
                <div style={{ display: "flex", justifyContent: "space-around", padding: "20px 0" }}>
                  <div style={{ textAlign: "center" }}>
                    <Progress type="circle" percent={68} strokeColor="#F84464" trailColor="#303030" />
                    <div style={{ color: "#fff", marginTop: "10px" }}>Gold Class Lounges</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Progress type="circle" percent={45} strokeColor="#1890ff" trailColor="#303030" />
                    <div style={{ color: "#fff", marginTop: "10px" }}>Economy Screens</div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title={<span style={{ color: "#fff" }}>Sales Target Achievement</span>} style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030" }}>
                <div style={{ padding: "10px 0" }}>
                  <div style={{ color: "#8c8c8c", marginBottom: "5px" }}>Quarterly Target (₹1,00,000)</div>
                  <Progress percent={(totalRevenue / 100000 * 100).toFixed(1)} status="active" strokeColor="#52c41a" trailColor="#303030" />
                </div>
              </Card>
            </Col>
          </Row>

          {/* Recent Bookings table */}
          <Card
            title={<span style={{ color: "#fff" }}>LATEST TRANSACTIONS</span>}
            style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", marginTop: "30px", borderRadius: "8px" }}
          >
            {recentBookings.length === 0 ? (
              <Empty description="No transaction bookings records found." image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Table
                columns={columns}
                dataSource={recentBookings}
                rowKey="bookingId"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 700 }}
                className="dark-table"
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default TheatreOwnerDashboard;
