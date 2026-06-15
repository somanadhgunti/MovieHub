import React from "react";
import { Card, Divider, Row, Col, Typography } from "antd";
import { formatCurrency, formatDate, formatTime } from "../../utils/dateUtils";

const { Title, Text } = Typography;

export const BookingSummary = ({ movie, show, selectedSeats }) => {
  if (!movie || !show || selectedSeats.length === 0) return null;

  const seatNames = selectedSeats.map(seat => {
    const row = seat.seat?.rowNumber || seat.rowNumber || "";
    const num = seat.seat?.seatNumber || seat.seatNumber || "";
    return `${row}${num}`;
  }).join(", ");
  const basePriceSum = selectedSeats.reduce((sum, seat) => sum + (seat.price || show.basePrice || 200), 0);
  
  // BookMyShow charges standard convenience fees and GST
  const convenienceFee = 25 * selectedSeats.length; 
  const gst = convenienceFee * 0.18;
  const totalAmount = basePriceSum + convenienceFee + gst;

  return (
    <Card
      title={<span style={{ color: "#ffffff", fontWeight: "bold" }}>BOOKING SUMMARY</span>}
      style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}
      bodyStyle={{ color: "#dfdfdf" }}
    >
      <Title level={4} style={{ color: "#ffffff", margin: "0 0 5px 0" }}>
        {movie.title}
      </Title>
      <Text type="secondary" style={{ display: "block", marginBottom: "15px" }}>
        {movie.language} • {movie.genre}
      </Text>

      <div style={{ marginBottom: "15px" }}>
        <Text style={{ display: "block" }}>{show.screen?.theatre?.name || show.theatreName || "Theatre Screen"}</Text>
        <Text type="secondary" style={{ fontSize: "13px" }}>
          {formatDate(show.showDate)} | {formatTime(show.startTime)}
        </Text>
      </div>

      <Divider style={{ borderColor: "#303030", margin: "12px 0" }} />

      <Row justify="space-between" style={{ marginBottom: "8px" }}>
        <Col>
          <Text>Tickets ({selectedSeats.length} Seats: {seatNames})</Text>
        </Col>
        <Col>
          <Text style={{ fontWeight: "bold" }}>{formatCurrency(basePriceSum)}</Text>
        </Col>
      </Row>

      <Row justify="space-between" style={{ marginBottom: "8px" }}>
        <Col>
          <Text>Convenience Fees</Text>
        </Col>
        <Col>
          <Text>{formatCurrency(convenienceFee)}</Text>
        </Col>
      </Row>

      <Row justify="space-between" style={{ marginBottom: "8px" }}>
        <Col>
          <Text type="secondary" style={{ fontSize: "12px" }}>Integrated GST (18%)</Text>
        </Col>
        <Col>
          <Text type="secondary" style={{ fontSize: "12px" }}>{formatCurrency(gst)}</Text>
        </Col>
      </Row>

      <Divider style={{ borderColor: "#303030", margin: "12px 0" }} />

      <Row justify="space-between" align="middle" style={{ marginTop: "10px" }}>
        <Col>
          <Title level={4} style={{ color: "#ffffff", margin: 0 }}>
            Amount Payable
          </Title>
        </Col>
        <Col>
          <Title level={4} style={{ color: "#F84464", margin: 0, fontWeight: "bold" }}>
            {formatCurrency(totalAmount)}
          </Title>
        </Col>
      </Row>
    </Card>
  );
};

export default BookingSummary;
