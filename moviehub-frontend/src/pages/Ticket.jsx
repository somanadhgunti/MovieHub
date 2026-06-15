import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Result, Button, Space, Spin, Alert } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ETicket from "../components/customer/ETicket";
import { getBookingById, resolveBookings } from "../services/bookingService";

export const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryBookingId = searchParams.get("bookingId");
  const stateBooking = location.state?.booking;

  const [booking, setBooking] = useState(stateBooking || null);
  const [loading, setLoading] = useState(!stateBooking && !!queryBookingId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stateBooking) {
      setBooking(stateBooking);
      setLoading(false);
      return;
    }

    const loadBookingData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookingById(queryBookingId);
        const resolved = await resolveBookings([data]);
        if (resolved && resolved.length > 0) {
          setBooking(resolved[0]);
        } else {
          throw new Error("Unable to resolve ticket coordinates.");
        }
      } catch (err) {
        console.error("Failed to load ticket details:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch ticket booking records from backend database.");
      } finally {
        setLoading(false);
      }
    };

    if (queryBookingId) {
      loadBookingData();
    } else if (!stateBooking) {
      setLoading(false);
    }
  }, [queryBookingId, stateBooking]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "#141414" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: "#F84464" }} spin />} />
        <span style={{ color: "#8c8c8c", marginTop: "15px" }}>Loading ticket details...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "#141414", padding: "20px" }}>
        <Alert
          message="Connection Error"
          description={error || "No active ticket records found."}
          type="error"
          showIcon
          style={{ maxWidth: "500px", width: "100%", marginBottom: "20px" }}
        />
        <Button type="primary" onClick={() => navigate("/home")} style={{ backgroundColor: "#F84464", borderColor: "#F84464" }}>
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#141414", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Visual success response */}
        <Result
          status="success"
          title={<span style={{ color: "#ffffff", fontWeight: "bold" }}>Booking Confirmed!</span>}
          subTitle={<span style={{ color: "#a0a0a0" }}>Your transaction was successful. We have sent the confirmation SMS/Email.</span>}
          className="no-print"
        />

        {/* E-Ticket Display */}
        <ETicket booking={booking} tickets={booking.tickets} />

        <div style={{ textAlign: "center", marginTop: "30px" }} className="no-print">
          <Space size="large">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/home")}
              style={{ backgroundColor: "#F84464", borderColor: "#F84464" }}
            >
              Book More Movies
            </Button>
            <Button
              size="large"
              onClick={() => navigate("/my-tickets")}
              style={{ backgroundColor: "#2b2b2b", color: "#fff", borderColor: "#434343" }}
            >
              View My Tickets
            </Button>
          </Space>
        </div>

      </div>
    </div>
  );
};

export default Ticket;
