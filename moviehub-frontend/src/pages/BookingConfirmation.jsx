import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Typography, Space, Modal, Divider, message } from "antd";
import { InfoCircleOutlined, ExclamationCircleOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { formatCurrency, formatDate, formatTime } from "../utils/dateUtils";

const { Title, Text } = Typography;

export const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract state details passed from Seat Selection (Booking.jsx)
  const { show, movie, selectedSeats } = location.state || {};
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!show || !movie || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div style={{ padding: "50px", textAlign: "center", background: "#141414", color: "#fff", minHeight: "100vh" }}>
        <Text style={{ color: "#fff" }}>No booking context found. Returning to storefront...</Text>
        <br /><br />
        <Button type="primary" onClick={() => navigate("/home")} style={{ backgroundColor: "#F84464" }}>Go Home</Button>
      </div>
    );
  }

  const seatNames = selectedSeats.map(s => {
    const row = s.seat?.rowNumber || s.rowNumber || "";
    const num = s.seat?.seatNumber || s.seatNumber || "";
    return `${row}${num}`;
  }).join(", ");
  const basePriceSum = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = 25 * selectedSeats.length;
  const gst = convenienceFee * 0.18;
  const totalAmount = basePriceSum + convenienceFee + gst;

  const handleConfirm = () => {
    setModalOpen(true);
  };

  const handleModalSubmit = () => {
    setModalOpen(false);
    setSubmitting(true);
    message.loading({ content: "Locking seats and opening secure payment gateway...", key: "gate" });
    
    // Redirect to the simulated payment card portal
    setTimeout(() => {
      message.destroy("gate");
      setSubmitting(false);
      navigate("/payment", {
        state: {
          show,
          movie,
          selectedSeats
        }
      });
    }, 1200);
  };

  return (
    <div style={{ backgroundColor: "#141414", color: "#ffffff", padding: "40px 20px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "650px", margin: "0 auto" }}>
        
        <Title level={2} style={{ color: "#ffffff", marginBottom: "30px", fontWeight: "bold" }}>
          Confirm Your Booking
        </Title>

        {/* Details review Card */}
        <Card
          style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "12px" }}
          bodyStyle={{ padding: "30px" }}
        >
          <Row gutter={[20, 20]}>
            {/* Movie Info */}
            <Col xs={24} sm={8}>
              <img src={movie.posterUrl} alt={movie.title} style={{ width: "100%", borderRadius: "8px", border: "1px solid #303030" }} />
            </Col>
            <Col xs={24} sm={16}>
              <Title level={3} style={{ color: "#ffffff", margin: "0 0 5px 0" }}>{movie.title}</Title>
              <Text type="secondary" style={{ color: "#8c8c8c" }}>{movie.language} • {movie.genre}</Text>
              
              <Divider style={{ borderColor: "#303030", margin: "15px 0" }} />

              {/* Theater & Screen details */}
              <div style={{ marginBottom: "15px" }}>
                <Text style={{ display: "block", color: "#dfdfdf", fontSize: "15px" }}>
                  <EnvironmentOutlined style={{ color: "#F84464", marginRight: "8px" }} />
                  {show.screen?.theatre?.name || show.theatreName || "Theatre"}
                </Text>
                <Text type="secondary" style={{ color: "#8c8c8c", fontSize: "13px", marginLeft: "22px" }}>
                  Screen {show.screen?.screenNumber || show.screenNumber || 1}
                </Text>
              </div>

              {/* Show Date & Time */}
              <div style={{ marginBottom: "15px" }}>
                <Text style={{ display: "block", color: "#dfdfdf", fontSize: "15px" }}>
                  <CalendarOutlined style={{ color: "#F84464", marginRight: "8px" }} />
                  {formatDate(show.showDate)} • {formatTime(show.startTime)}
                </Text>
              </div>
            </Col>
          </Row>

          <Divider style={{ borderColor: "#303030", margin: "20px 0" }} />

          {/* Pricing & Seats block */}
          <div style={{ backgroundColor: "#141414", padding: "20px", borderRadius: "8px", border: "1px solid #303030", marginBottom: "25px" }}>
            <Row justify="space-between" style={{ marginBottom: "10px" }}>
              <Col><Text style={{ color: "#8c8c8c" }}>Selected Seats</Text></Col>
              <Col><Text style={{ color: "#F84464", fontWeight: "bold" }}>{seatNames}</Text></Col>
            </Row>
            <Row justify="space-between" style={{ marginBottom: "10px" }}>
              <Col><Text style={{ color: "#8c8c8c" }}>Seat Base Price</Text></Col>
              <Col><Text style={{ color: "#ffffff" }}>{formatCurrency(basePriceSum)}</Text></Col>
            </Row>
            <Row justify="space-between" style={{ marginBottom: "10px" }}>
              <Col><Text style={{ color: "#8c8c8c" }}>Convenience Fee + GST</Text></Col>
              <Col><Text style={{ color: "#ffffff" }}>{formatCurrency(convenienceFee + gst)}</Text></Col>
            </Row>
            <Divider style={{ borderColor: "#303030", margin: "10px 0" }} />
            <Row justify="space-between" align="middle">
              <Col><Text style={{ color: "#ffffff", fontSize: "16px", fontWeight: "bold" }}>Total Amount</Text></Col>
              <Col><Text style={{ color: "#52c41a", fontSize: "20px", fontWeight: "bold" }}>{formatCurrency(totalAmount)}</Text></Col>
            </Row>
          </div>

          {/* Confirm & Cancel Buttons */}
          <Row gutter={16}>
            <Col span={12}>
              <Button
                block
                size="large"
                onClick={() => navigate(-1)}
                style={{ backgroundColor: "transparent", color: "#8c8c8c", borderColor: "#434343" }}
              >
                Cancel
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                type="primary"
                size="large"
                loading={submitting}
                onClick={handleConfirm}
                style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
              >
                Confirm Booking
              </Button>
            </Col>
          </Row>

        </Card>

        {/* Professional Confirmation Modal Dialog */}
        <Modal
          title={
            <span style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold" }}>
              <ExclamationCircleOutlined style={{ color: "#faad14", marginRight: "10px" }} />
              Confirm Seats Selection?
            </span>
          }
          open={modalOpen}
          onOk={handleModalSubmit}
          onCancel={() => setModalOpen(false)}
          okText="Yes, Confirm"
          cancelText="No, Change"
          okButtonProps={{ style: { backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" } }}
          cancelButtonProps={{ style: { backgroundColor: "transparent", color: "#8c8c8c" } }}
          style={{ top: "30%" }}
        >
          <div style={{ margin: "20px 0", color: "#dfdfdf" }}>
            <p>You have selected seats <strong>{seatNames}</strong> for <strong>{movie.title}</strong>.</p>
            <p>Once confirmed, these seats will be locked temporarily for 5 minutes to complete your secure payment transaction.</p>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default BookingConfirmation;
