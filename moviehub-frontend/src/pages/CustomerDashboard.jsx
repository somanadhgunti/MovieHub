import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tabs, Table, Tag, Typography, Button, Avatar, Alert, Empty, Spin } from "antd";
import { UserOutlined, CalendarOutlined, FileTextOutlined, LoadingOutlined, IdcardOutlined, BarcodeOutlined } from "@ant-design/icons";
import { formatCurrency, formatDate, formatTime } from "../utils/dateUtils";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getBookingsByUser, resolveBookings } from "../services/bookingService";

const { Title, Text, Paragraph } = Typography;

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = user?.id || 1;
        const data = await getBookingsByUser(userId);
        const resolved = await resolveBookings(data);
        setBookings(resolved);
      } catch (err) {
        console.error("Dashboard bookings loading failed:", err);
        setError("Failed to retrieve your transaction booking history.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  // Extract all tickets from resolved bookings
  const ticketsList = bookings.flatMap(b => (b.tickets || []).map(t => ({
    ticketId: t.ticketId || t.id,
    ticketNumber: t.ticketNumber,
    qrCode: t.qrCode,
    ticketStatus: t.ticketStatus,
    movieTitle: b.movieTitle,
    theatreName: b.theatreName,
    theatreCity: b.theatreCity,
    screenNumber: b.screenNumber,
    showDate: b.showDate,
    showTime: b.showTime,
    seats: b.seats,
    bookingNumber: b.bookingNumber
  })));

  const bookingColumns = [
    {
      title: "Booking Ref",
      dataIndex: "bookingNumber",
      key: "bookingNumber",
      render: (text) => <Text style={{ color: "#fff", fontFamily: "monospace" }}>{text}</Text>,
    },
    {
      title: "Movie",
      dataIndex: "movieTitle",
      key: "movieTitle",
      render: (text, record) => (
        <div>
          <span style={{ fontWeight: "bold", color: "#fff" }}>{text}</span>
          <span style={{ display: "block", fontSize: "11px", color: "#8c8c8c" }}>{record.language}</span>
        </div>
      ),
    },
    {
      title: "Cinema Screen",
      dataIndex: "theatreName",
      key: "theatreName",
      render: (text, record) => (
        <div>
          <span>{text}</span>
          <span style={{ display: "block", fontSize: "11px", color: "#8c8c8c" }}>Screen {record.screenNumber}</span>
        </div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "showDate",
      key: "showDate",
      render: (text, record) => (
        <div>
          <span>{formatDate(text)}</span>
          <span style={{ display: "block", fontSize: "11px", color: "#8c8c8c" }}>{formatTime(record.showTime)}</span>
        </div>
      ),
    },
    {
      title: "Seats",
      dataIndex: "seats",
      key: "seats",
      render: (seats) => (
        <span style={{ color: "#F84464", fontWeight: "500" }}>
          {seats?.map(s => `${s.rowNumber}${s.seatNumber}`).join(", ") || "N/A"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => (
        <Tag color={status === "CONFIRMED" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => <span style={{ fontWeight: "bold" }}>{formatCurrency(amount)}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<FileTextOutlined />}
          style={{ backgroundColor: "#2b2b2b", borderColor: "#434343" }}
          onClick={() => navigate("/ticket", { state: { booking: record } })}
        >
          View Ticket
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "#141414" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: "#F84464" }} spin />} />
        <span style={{ color: "#8c8c8c", marginTop: "15px" }}>Syncing dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: "#141414", color: "#ffffff", padding: "40px 20px", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Alert message="Connection Error" description={error} type="error" showIcon />
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#141414", color: "#ffffff", padding: "40px 20px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <Title level={2} style={{ color: "#ffffff", marginBottom: "30px", fontWeight: "bold" }}>My Dashboard</Title>

        <Row gutter={[24, 24]}>
          
          {/* Section 1: Profile Details Card */}
          <Col xs={24} md={6}>
            <Card
              title={<span style={{ color: "#fff" }}><IdcardOutlined /> Profile Details</span>}
              style={{
                backgroundColor: "#1f1f1f",
                border: "1px solid #303030",
                textAlign: "center",
                borderRadius: "8px"
              }}
            >
              <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: "#F84464", marginBottom: "15px" }} />
              <Title level={4} style={{ color: "#fff", margin: "0 0 5px 0" }}>
                {user?.username || "Guest"}
              </Title>
              <Text type="secondary" style={{ color: "#8c8c8c", display: "block", marginBottom: "10px" }}>
                Role: {user?.role || "CUSTOMER"}
              </Text>
              <Tag color="green" style={{ border: "none" }}>Status: Active</Tag>
            </Card>
          </Col>

          {/* History Lists */}
          <Col xs={24} md={18}>
            <Card style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}>
              <Tabs
                defaultActiveKey="bookings"
                items={[
                  // Section 2: Recent Bookings
                  {
                    key: "bookings",
                    label: <span style={{ fontSize: "16px" }}><CalendarOutlined /> Recent Bookings</span>,
                    children: bookings.length === 0 ? (
                      <Empty description="No bookings history recorded yet." image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                      <Table
                        columns={bookingColumns}
                        dataSource={bookings}
                        rowKey="bookingId"
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 800 }}
                        className="dark-table"
                        style={{ backgroundColor: "transparent" }}
                      />
                    ),
                  },
                  // Section 3: Recent Tickets
                  {
                    key: "tickets",
                    label: <span style={{ fontSize: "16px" }}><BarcodeOutlined /> Recent Tickets</span>,
                    children: ticketsList.length === 0 ? (
                      <Empty description="No active tickets generated yet." image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                      <Row gutter={[16, 16]}>
                        {ticketsList.map((ticket, idx) => {
                          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100&data=${ticket.qrCode || ticket.ticketNumber}`;
                          const seatNames = ticket.seats?.map(s => `${s.rowNumber}${s.seatNumber}`).join(", ") || "N/A";
                          return (
                            <Col key={idx} xs={24} sm={12}>
                              <Card 
                                style={{ backgroundColor: "#141414", border: "1px dashed #303030" }}
                                bodyStyle={{ padding: "16px" }}
                              >
                                <Row align="middle" gutter={12}>
                                  <Col span={16}>
                                    <div style={{ fontWeight: "bold", fontSize: "15px", color: "#fff", marginBottom: "4px" }}>
                                      {ticket.movieTitle}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                                      Cinema: {ticket.theatreName}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                                      Date: {formatDate(ticket.showDate)} at {formatTime(ticket.showTime)}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#F84464", fontWeight: "bold", marginTop: "4px" }}>
                                      Seats: {seatNames}
                                    </div>
                                  </Col>
                                  <Col span={8} style={{ textAlign: "center" }}>
                                    <img src={qrUrl} alt="QR Code" style={{ width: "70px", height: "70px", background: "#fff", padding: "4px", borderRadius: "4px" }} />
                                    <div style={{ fontSize: "9px", fontFamily: "monospace", color: "#8c8c8c", marginTop: "4px" }}>
                                      {ticket.ticketNumber}
                                    </div>
                                  </Col>
                                </Row>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    ),
                  }
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CustomerDashboard;
