import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Radio, Input, Button, Card, Space, message, Spin, Typography } from "antd";
import { CreditCardOutlined, WalletOutlined, BankOutlined, MobileOutlined, LoadingOutlined } from "@ant-design/icons";
import BookingSummary from "../components/customer/BookingSummary";
import { initiatePayment, processPayment } from "../services/paymentService";
import { createBooking } from "../services/bookingService";
import { generateTicket } from "../services/ticketService";
import { useAuth } from "../hooks/useAuth";
import notificationService from "../utils/notificationService";

const { Title, Text } = Typography;

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Retrieve selected data passed from route redirection state
  const { show, movie, selectedSeats } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");

  if (!show || !movie || !selectedSeats) {
    return (
      <div style={{ padding: "50px", textAlign: "center", background: "#141414", color: "#fff", minHeight: "100vh" }}>
        <Text style={{ color: "#fff" }}>No checkout records found. Redirecting to storefront...</Text>
        <br /><br />
        <Button type="primary" onClick={() => navigate("/home")} style={{ backgroundColor: "#F84464" }}>Go Home</Button>
      </div>
    );
  }

  const handlePay = async () => {
    if (paymentMethod === "CARD" && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      message.error("Please fill all Card details.");
      return;
    }
    if (paymentMethod === "UPI" && !upiId) {
      message.error("Please enter your UPI VPA ID.");
      return;
    }

    const bookingPayload = {
      userId: user?.id || 1,
      showId: show.id,
      showSeatIds: selectedSeats.map(s => s.id)
    };
    console.log("[Payment] Booking request payload:", bookingPayload);

    setProcessing(true);
    try {
      // 1. Create booking in DB
      const bookingResponse = await createBooking(bookingPayload);
      console.log("[Payment] Booking response received:", bookingResponse);

      const bookingId = bookingResponse.bookingId || bookingResponse.id;

      // 2. Generate Tickets in DB
      console.log(`[Payment] Generating ticket request for booking ID: ${bookingId}`);
      const tickets = await generateTicket(bookingId);
      console.log("[Payment] Ticket generation response received:", tickets);

      // 3. Initiate simulated Payment
      console.log("[Payment] Initiating simulated payment for booking ID:", bookingId);
      const paymentResponse = await initiatePayment({
        bookingId: bookingId,
        amount: bookingResponse.totalAmount,
        paymentMethod: paymentMethod
      });
      console.log("[Payment] Payment initiation response:", paymentResponse);

      // 4. Process simulated Payment
      console.log("[Payment] Processing simulated payment for payment ID:", paymentResponse.id);
      const paymentProcessResponse = await processPayment({
        paymentId: paymentResponse.id,
        transactionId: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: "SUCCESS"
      });
      console.log("[Payment] Payment processing response:", paymentProcessResponse);

      // Latency simulation for immersive feel
      setTimeout(() => {
        setProcessing(false);
        notificationService.success("Booking & Payment Successful", "Your tickets have been successfully generated!");
        
        const bookingState = {
          bookingId: bookingId,
          bookingNumber: bookingResponse.bookingNumber,
          totalSeats: bookingResponse.totalSeats,
          totalAmount: bookingResponse.totalAmount,
          movieTitle: movie.title,
          language: movie.language,
          theatreName: show.screen?.theatre?.name || show.theatreName,
          theatreCity: show.screen?.theatre?.city || show.theatreCity,
          screenNumber: show.screen?.screenNumber || show.screenNumber,
          showDate: show.showDate,
          showTime: show.startTime,
          seats: selectedSeats.map(s => ({
            ...s.seat,
            showSeatId: s.id
          })),
          tickets: tickets
        };
        console.log("[Payment] Navigation event: Redirecting to /ticket with state:", bookingState);
        // Redirect to final E-Ticket page with ticket details
        navigate("/ticket", {
          state: {
            booking: bookingState
          }
        });
      }, 2000);

    } catch (error) {
      setProcessing(false);
      const backendErrorMessage = error.response?.data?.message || error.message || String(error);
      console.error("[Payment] Booking payment flow failed. Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      notificationService.error("Booking Payment Failed", backendErrorMessage);
    }
  };

  return (
    <div style={{ backgroundColor: "#141414", color: "#ffffff", padding: "40px 20px", minHeight: "100vh" }}>
      {processing ? (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "400px" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 50, color: "#F84464" }} spin />} />
          <Title level={3} style={{ color: "#ffffff", marginTop: "25px" }}>Processing Payment...</Title>
          <Text type="secondary" style={{ color: "#8c8c8c" }}>Please do not refresh the page or hit the back button.</Text>
        </div>
      ) : (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Title level={2} style={{ color: "#ffffff", marginBottom: "30px", fontWeight: "bold" }}>Checkout</Title>
          
          <Row gutter={[24, 24]}>
            {/* Payment Methods Input */}
            <Col xs={24} md={14}>
              <Card title={<span style={{ color: "#fff" }}>CHOOSE PAYMENT METHOD</span>} style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030" }}>
                
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    
                    {/* Card radio element */}
                    <Card style={{ backgroundColor: "#141414", border: "1px solid #303030" }} bodyStyle={{ padding: "12px" }}>
                      <Radio value="CARD" style={{ color: "#fff", width: "100%" }}>
                        <Space><CreditCardOutlined /> Credit / Debit Card</Space>
                      </Radio>
                      {paymentMethod === "CARD" && (
                        <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                          <Input
                            placeholder="Card Number (16 Digits)"
                            maxLength={16}
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }}
                          />
                          <div style={{ display: "flex", gap: "10px" }}>
                            <Input
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }}
                            />
                            <Input.Password
                              placeholder="CVV"
                              maxLength={3}
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }}
                            />
                          </div>
                        </div>
                      )}
                    </Card>

                    {/* UPI radio element */}
                    <Card style={{ backgroundColor: "#141414", border: "1px solid #303030" }} bodyStyle={{ padding: "12px" }}>
                      <Radio value="UPI" style={{ color: "#fff", width: "100%" }}>
                        <Space><MobileOutlined /> UPI (Google Pay, PhonePe, BHIM)</Space>
                      </Radio>
                      {paymentMethod === "UPI" && (
                        <div style={{ marginTop: "15px" }}>
                          <Input
                            placeholder="Enter UPI VPA ID (e.g., username@okhdfcbank)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }}
                          />
                        </div>
                      )}
                    </Card>

                    {/* NetBanking Stub */}
                    <Card style={{ backgroundColor: "#141414", border: "1px solid #303030" }} bodyStyle={{ padding: "12px" }}>
                      <Radio value="NET_BANKING" style={{ color: "#fff" }}>
                        <Space><BankOutlined /> Net Banking</Space>
                      </Radio>
                    </Card>

                    {/* Wallet Stub */}
                    <Card style={{ backgroundColor: "#141414", border: "1px solid #303030" }} bodyStyle={{ padding: "12px" }}>
                      <Radio value="WALLET" style={{ color: "#fff" }}>
                        <Space><WalletOutlined /> Wallet Providers (Paytm, Mobikwik)</Space>
                      </Radio>
                    </Card>

                  </Space>
                </Radio.Group>

                <Button
                  type="primary"
                  size="large"
                  onClick={handlePay}
                  style={{
                    width: "100%",
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                    fontWeight: "bold",
                    marginTop: "30px",
                    height: "48px"
                  }}
                >
                  Pay Securely
                </Button>
              </Card>
            </Col>

            {/* Booking Summary display Column */}
            <Col xs={24} md={10}>
              <BookingSummary
                movie={movie}
                show={show}
                selectedSeats={selectedSeats}
              />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Payment;
