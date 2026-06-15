import React from "react";
import { Card, Row, Col, Typography, Button, Space, Tag } from "antd";
import { PrinterOutlined, QrcodeOutlined, BarcodeOutlined } from "@ant-design/icons";
import { formatCurrency, formatDate, formatTime } from "../../utils/dateUtils";

const { Title, Text } = Typography;

export const ETicket = ({ booking, tickets }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const firstTicket = tickets?.[0] || {};
  const qrMock = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingNumber}`;

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto" }}>
      <Card
        style={{
          background: "#1f1f1f",
          border: "2px dashed #f5222d",
          borderRadius: "12px",
          color: "#ffffff",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: "0" }}
      >
        <Row align="stretch">
          {/* Main Ticket Info */}
          <Col xs={24} sm={16} style={{ padding: "30px", borderRight: "2px dashed #303030" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
              <div>
                <Tag color="#F84464" style={{ marginBottom: "10px" }}>M-TICKET</Tag>
                <Title level={2} style={{ color: "#ffffff", margin: 0 }}>
                  {booking.movieTitle || "Movie Title"}
                </Title>
                <Text type="secondary" style={{ color: "#a0a0a0" }}>
                  {booking.language || "Hindi/English"} • 2D
                </Text>
              </div>
            </div>

            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col span={12}>
                <Text type="secondary" style={{ display: "block", color: "#8c8c8c" }}>CINEMA</Text>
                <Text style={{ fontWeight: "bold" }}>{booking.theatreName || "MovieHub Cinemas"}</Text>
                <Text type="secondary" style={{ display: "block", fontSize: "12px" }}>
                  {booking.theatreCity || "Mumbai"}
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ display: "block", color: "#8c8c8c" }}>SCREEN</Text>
                <Text style={{ fontWeight: "bold" }}>Screen {booking.screenNumber || "1"}</Text>
              </Col>
              
              <Col span={12}>
                <Text type="secondary" style={{ display: "block", color: "#8c8c8c" }}>DATE & TIME</Text>
                <Text style={{ fontWeight: "bold" }}>
                  {formatDate(booking.showDate)}
                </Text>
                <Text type="secondary" style={{ display: "block" }}>
                  {formatTime(booking.showTime)}
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ display: "block", color: "#8c8c8c" }}>SEAT INFOS</Text>
                <Text style={{ fontWeight: "bold", color: "#F84464" }}>
                  {booking.seats?.map(s => `${s.rowNumber}${s.seatNumber}`).join(", ") || "A1, A2"}
                </Text>
                <Text type="secondary" style={{ display: "block", fontSize: "12px" }}>
                  ({booking.totalSeats || 1} Ticket(s))
                </Text>
              </Col>
            </Row>

            <div style={{ marginTop: "25px", borderTop: "1px solid #303030", paddingTop: "15px" }}>
              <Row justify="space-between">
                <Col>
                  <Text type="secondary" style={{ color: "#8c8c8c" }}>BOOKING ID</Text>
                  <Text style={{ display: "block", fontFamily: "monospace", fontSize: "14px" }}>
                    {booking.bookingNumber}
                  </Text>
                </Col>
                <Col style={{ textAlign: "right" }}>
                  <Text type="secondary" style={{ color: "#8c8c8c" }}>TOTAL AMOUNT</Text>
                  <Text style={{ display: "block", fontWeight: "bold", color: "#52c41a" }}>
                    {formatCurrency(booking.totalAmount)}
                  </Text>
                </Col>
              </Row>
            </div>
          </Col>

          {/* QR Side Code */}
          <Col xs={24} sm={8} style={{ backgroundColor: "#141414", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px" }}>
            <div style={{ background: "#ffffff", padding: "8px", borderRadius: "8px", marginBottom: "15px" }}>
              <img src={qrMock} alt="QR Code" style={{ width: "120px", height: "120px", display: "block" }} />
            </div>
            <Text type="secondary" style={{ fontSize: "11px", color: "#8c8c8c", textAlign: "center", display: "block" }}>
              Show this QR code at the cinema entry gate.
            </Text>
            <BarcodeOutlined style={{ fontSize: "32px", color: "#8c8c8c", marginTop: "15px" }} />
          </Col>
        </Row>
      </Card>
      
      <div style={{ textAlign: "right", marginTop: "15px" }} className="no-print">
        <Space>
          <Button icon={<PrinterOutlined />} onClick={handlePrint} style={{ backgroundColor: "#2b2b2b", color: "#fff", borderColor: "#434343" }}>
            Print E-Ticket
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ETicket;
