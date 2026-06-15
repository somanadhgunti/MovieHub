import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Tag, Button, Typography, Row, Col, Breadcrumb, Spin, Alert, Empty, Space } from "antd";
import { CalendarOutlined, ClockCircleOutlined, LoadingOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { getMovieById } from "../services/movieService";
import { getShowsByMovie } from "../services/showService";
import { formatTime, formatDate } from "../utils/dateUtils";

const { Title, Text } = Typography;

export const Shows = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const movieData = await getMovieById(movieId);
        setMovie(movieData);

        const showData = await getShowsByMovie(movieId);
        setShows(showData || []);
      } catch (err) {
        console.error("Failed to load show selection data:", err);
        setError("Failed to retrieve showtimes scheduling from backend.");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadData();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "500px", background: "#141414" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: "#F84464" }} spin />} />
        <span style={{ color: "#8c8c8c", marginTop: "15px" }}>Loading show schedules...</span>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "400px", background: "#141414", padding: "20px" }}>
        <Alert
          message="Connection Error"
          description={error || "Movie details are not available."}
          type="error"
          showIcon
          style={{ maxWidth: "500px", width: "100%", marginBottom: "20px" }}
        />
        <Button type="primary" onClick={() => navigate("/home")} style={{ backgroundColor: "#F84464", borderColor: "#F84464" }}>
          Back to Homepage
        </Button>
      </div>
    );
  }

  // Group shows by Theatre ID/Name
  const uniqueTheatres = Array.from(
    new Set(shows.map(s => s.screen?.theatre?.id).filter(Boolean))
  ).map(theatreId => {
    const theatreShows = shows.filter(s => s.screen?.theatre?.id === theatreId);
    const firstShow = theatreShows[0];
    return {
      id: theatreId,
      name: firstShow.screen?.theatre?.name || "Theatre",
      city: firstShow.screen?.theatre?.city || "",
      shows: theatreShows
    };
  });

  return (
    <div style={{ backgroundColor: "#141414", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Navigation Breadcrumb */}
        <Breadcrumb
          style={{ marginBottom: "25px" }}
          items={[
            { title: <Link to="/home" style={{ color: "#8c8c8c" }}>Home</Link> },
            { title: <Link to={`/movies/${movie.id}`} style={{ color: "#8c8c8c" }}>{movie.title}</Link> },
            { title: <span style={{ color: "#ffffff" }}>Showtimes</span> }
          ]}
        />

        {/* Movie Info Header Card */}
        <Card style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px", marginBottom: "30px" }}>
          <Row gutter={[20, 20]} align="middle">
            <Col xs={24} sm={6} md={4}>
              <img 
                src={movie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop"} 
                alt={movie.title} 
                style={{ width: "100%", borderRadius: "6px", border: "1px solid #303030" }} 
              />
            </Col>
            <Col xs={24} sm={18} md={20}>
              <Title level={3} style={{ color: "#fff", margin: "0 0 8px 0" }}>{movie.title}</Title>
              <Space size="middle" style={{ flexWrap: "wrap", marginBottom: "12px" }}>
                <Tag color="#F84464" style={{ border: "none" }}>{movie.language || "English"}</Tag>
                <Tag color="#333" style={{ border: "none", color: "#dfdfdf" }}>{movie.genre || "N/A"}</Tag>
                <span style={{ color: "#8c8c8c" }}><ClockCircleOutlined /> {movie.duration || "N/A"} Mins</span>
              </Space>
              <div style={{ color: "#faad14" }}>
                ★ {movie.rating ? movie.rating.toFixed(1) : "8.0"}/10 rating from viewers
              </div>
            </Col>
          </Row>
        </Card>

        {/* Selection Details Title */}
        <div style={{ marginBottom: "20px" }}>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            <CalendarOutlined style={{ marginRight: "8px", color: "#F84464" }} />
            Available Cinema Showtimes
          </Title>
        </div>

        {uniqueTheatres.length === 0 ? (
          <Empty 
            description="No screenings are currently available for this movie." 
            style={{ padding: "40px" }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          /* List of Theatres showing this Movie */
          <div>
            {uniqueTheatres.map((theatre) => (
              <Card
                key={theatre.id}
                title={
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "16px" }}>{theatre.name}</span>
                    <span style={{ color: "#8c8c8c", fontSize: "12px", fontWeight: "normal" }}>
                      <EnvironmentOutlined style={{ marginRight: "4px" }} />
                      {theatre.city}
                    </span>
                  </div>
                }
                style={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #303030",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  overflow: "hidden"
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <Row gutter={[16, 16]}>
                  {theatre.shows.map((show) => (
                    <Col key={show.id} xs={24} sm={12} md={8}>
                      <Card
                        style={{
                          backgroundColor: "#141414",
                          border: "1px solid #303030",
                          textAlign: "center"
                        }}
                        bodyStyle={{ padding: "16px" }}
                      >
                        <div style={{ fontWeight: "bold", color: "#F84464", fontSize: "14px", marginBottom: "8px" }}>
                          {show.screen?.name || `Screen ${show.screen?.screenNumber || 1}`}
                        </div>
                        <div style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", marginBottom: "4px" }}>
                          {formatTime(show.startTime)}
                        </div>
                        <div style={{ color: "#8c8c8c", fontSize: "13px", marginBottom: "12px" }}>
                          Date: {formatDate(show.showDate)}
                        </div>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => navigate(`/booking?showId=${show.id}`)}
                          style={{
                            backgroundColor: "#52c41a",
                            borderColor: "#52c41a",
                            fontWeight: "bold",
                            width: "100%"
                          }}
                        >
                          Select Seats
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Shows;
