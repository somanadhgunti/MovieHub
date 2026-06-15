import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Typography, Space, Divider, message, Spin, Alert, Empty } from "antd";
import { LoadingOutlined, DesktopOutlined } from "@ant-design/icons";
import { getShowById, getShowSeatLayout, lockSeats, generateShowSeats } from "../services/showService";
import { getMovieById } from "../services/movieService";
import { useAuth } from "../hooks/useAuth";
import { formatTime } from "../utils/dateUtils";

const { Title, Text } = Typography;

export const Booking = () => {
  const [searchParams] = useSearchParams();
  const showId = searchParams.get("showId");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [show, setShow] = useState(null);
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const loadBookingData = async () => {
      setLoading(true);
      setError(null);
      try {
        const showData = await getShowById(showId);
        if (!showData) {
          throw new Error("Show details not found");
        }
        setShow(showData);
        
        const movieData = await getMovieById(showData.movieId);
        setMovie(movieData);

        let layoutData = await getShowSeatLayout(showId);
        if (!layoutData || layoutData.length === 0) {
          try {
            await generateShowSeats(showId);
            layoutData = await getShowSeatLayout(showId);
          } catch (genErr) {
            console.error("Auto seat generation failed on backend:", genErr);
          }
        }

        if (!layoutData || layoutData.length === 0) {
          throw new Error("No seats layout generated for this show.");
        }

        setSeats(layoutData);
      } catch (err) {
        console.error("Backend API connection failed:", err);
        setError(err.response?.data?.message || err.message || "Failed to load show seat layout from backend.");
      } finally {
        setLoading(false);
      }
    };

    if (showId) {
      loadBookingData();
    }
  }, [showId]);

  const handleSeatClick = (seat) => {
    if (seat.status === "BOOKED" || seat.status === "RESERVED" || seat.status === "MAINTENANCE") return;

    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 10) {
        message.warning("You can choose up to 10 seats per booking.");
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) {
      message.error("Please select at least one seat.");
      return;
    }

    setBookingLoading(true);
    try {
      await lockSeats({
        userId: user?.id || 1,
        showSeatIds: selectedSeats.map((s) => s.id),
      });

      navigate("/booking-confirmation", {
        state: {
          show,
          movie,
          selectedSeats,
        },
      });
    } catch (err) {
      console.error("Seat lock failed:", err);
      message.error(err.response?.data?.message || err.message || "Failed to lock the selected seats. They might have been taken.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "500px", background: "#141414" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: "#F84464" }} spin />} />
        <span style={{ color: "#8c8c8c", marginTop: "15px" }}>Loading seat maps...</span>
      </div>
    );
  }

  if (error || !show || !movie) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "400px", background: "#141414", padding: "20px" }}>
        <Alert
          message="Connection Error"
          description={error || "Seating layout is currently unavailable."}
          type="error"
          showIcon
          style={{ maxWidth: "500px", width: "100%", marginBottom: "20px" }}
        />
        <Button type="primary" onClick={() => navigate(-1)} style={{ backgroundColor: "#F84464", borderColor: "#F84464" }}>
          Go Back
        </Button>
      </div>
    );
  }

  // Get layout configuration from backend values
  const seatWidth = show.screen?.seatWidth || 30;
  const seatHeight = show.screen?.seatHeight || 30;
  const totalCols = show.screen?.totalColumns || Math.max(...seats.map(s => s.seat?.seatNumber || 0), 10);

  // Group and sort rows
  const rowNames = Array.from(new Set(seats.map((s) => s.seat?.rowNumber).filter(Boolean))).sort();

  return (
    <div style={{ backgroundColor: "#141414", color: "#ffffff", padding: "40px 20px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Top Summary Block */}
        <Row justify="space-between" align="middle" style={{ marginBottom: "30px", borderBottom: "1px solid #303030", paddingBottom: "20px" }}>
          <Col>
            <Title level={3} style={{ color: "#ffffff", margin: 0 }}>{movie.title}</Title>
            <Text type="secondary" style={{ color: "#8c8c8c" }}>
              {show.screen?.theatre?.name || "Theatre"} | Screen {show.screen?.screenNumber || 1} | {show.showDate} | {formatTime(show.startTime)}
            </Text>
          </Col>
          <Col>
            <Button onClick={() => navigate(-1)} style={{ backgroundColor: "transparent", color: "#F84464", borderColor: "#F84464" }}>
              Back to Showtimes
            </Button>
          </Col>
        </Row>

        {/* Legend Indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: "25px", marginBottom: "35px", flexWrap: "wrap" }}>
          <Space>
            <div style={{ width: "20px", height: "20px", background: "#52c41a", borderRadius: "4px" }}></div>
            <span style={{ color: "#8c8c8c" }}>Available (Green)</span>
          </Space>
          <Space>
            <div style={{ width: "20px", height: "20px", background: "#1890ff", borderRadius: "4px" }}></div>
            <span style={{ color: "#8c8c8c" }}>Selected (Blue)</span>
          </Space>
          <Space>
            <div style={{ width: "20px", height: "20px", background: "#f5222d", borderRadius: "4px" }}></div>
            <span style={{ color: "#8c8c8c" }}>Booked (Red)</span>
          </Space>
        </div>

        {/* Seating Layout Card */}
        <Card style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", padding: "40px 10px", overflowX: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
            
            {/* SCREEN AREA AT TOP */}
            <div style={{ width: "70%", textAlign: "center", marginBottom: "50px" }}>
              <div style={{ borderBottom: "4px solid #1890ff", borderRadius: "0 0 100% 100%", height: "20px", filter: "drop-shadow(0 4px 6px rgba(24, 144, 255, 0.4))" }}></div>
              <Text type="secondary" style={{ display: "block", color: "#8c8c8c", fontSize: "11px", letterSpacing: "3px", marginTop: "10px" }}>
                SCREEN AREA (ALL EYES THIS WAY)
              </Text>
            </div>

            {/* Rows list */}
            {rowNames.length === 0 ? (
              <Empty description="No seat grid generated." image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                {rowNames.map((rowName) => {
                  const rowSeats = seats.filter((s) => s.seat?.rowNumber === rowName);
                  return (
                    <div key={rowName} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      {/* Left Row Label */}
                      <span style={{ width: "25px", fontWeight: "bold", color: "#8c8c8c", textAlign: "center" }}>{rowName}</span>
                      
                      {/* Columns */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        {Array.from({ length: totalCols }, (_, index) => {
                          const colNum = index + 1;
                          const seat = rowSeats.find((s) => s.seat?.seatNumber === colNum);
                          
                          if (!seat) {
                            // Render gap spacing if no seat in this column index
                            return (
                              <div 
                                key={`empty-${colNum}`} 
                                style={{ width: `${seatWidth}px`, height: `${seatHeight}px` }} 
                              />
                            );
                          }

                          const isSelected = selectedSeats.some((s) => s.id === seat.id);
                          const isSold = seat.status === "BOOKED" || seat.status === "RESERVED";
                          const isMaintenance = seat.status === "MAINTENANCE";
                          
                          let seatBg = "#52c41a"; // Available -> Green
                          let seatBorder = "1px solid #52c41a";
                          let cursor = "pointer";

                          if (isSelected) {
                            seatBg = "#1890ff"; // Selected -> Blue
                            seatBorder = "1px solid #1890ff";
                          } else if (isSold) {
                            seatBg = "#f5222d"; // Booked -> Red
                            seatBorder = "1px solid #f5222d";
                            cursor = "not-allowed";
                          } else if (isMaintenance) {
                            seatBg = "#faad14"; // Maintenance -> Yellow/Orange
                            seatBorder = "1px solid #faad14";
                            cursor = "not-allowed";
                          }

                          return (
                            <div
                              key={seat.id}
                              onClick={() => handleSeatClick(seat)}
                              title={`${seat.seat?.rowNumber}${seat.seat?.seatNumber} - ₹${seat.price}`}
                              style={{
                                width: `${seatWidth}px`,
                                height: `${seatHeight}px`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: "bold",
                                borderRadius: "4px",
                                background: seatBg,
                                border: seatBorder,
                                cursor: cursor,
                                color: "#ffffff",
                                transition: "all 0.15s ease",
                              }}
                            >
                              {seat.seat?.seatNumber}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Right Row Label */}
                      <span style={{ width: "25px", fontWeight: "bold", color: "#8c8c8c", textAlign: "center" }}>{rowName}</span>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </Card>

        {/* Selected List details and Proceed To Book Button */}
        {selectedSeats.length > 0 && (
          <Card
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#1f1f1f",
              borderTop: "2px solid #303030",
              boxShadow: "0 -4px 15px rgba(0,0,0,0.6)",
              padding: "10px 40px",
              zIndex: 99,
            }}
            bodyStyle={{ padding: "10px 0" }}
          >
            <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <Text style={{ color: "#8c8c8c" }}>Selected Seats: </Text>
                <span style={{ fontWeight: "bold", color: "#ffffff", fontSize: "16px" }}>
                  {selectedSeats.map((s) => `${s.seat?.rowNumber}${s.seat?.seatNumber}`).join(", ")}
                </span>
                <Divider type="vertical" style={{ borderColor: "#434343", margin: "0 15px" }} />
                <Text style={{ color: "#8c8c8c" }}>Total Amount: </Text>
                <span style={{ fontWeight: "bold", color: "#52c41a", fontSize: "20px" }}>
                  ₹{selectedSeats.reduce((sum, s) => sum + s.price, 0)}
                </span>
              </div>
              <Button
                type="primary"
                size="large"
                loading={bookingLoading}
                onClick={handleProceedToPayment}
                style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold", padding: "0 40px" }}
              >
                Proceed To Book
              </Button>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default Booking;
