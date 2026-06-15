import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Typography, Tag, Button, Card, Divider, Avatar, Space, Segmented, Rate, Spin, Alert, Empty } from "antd";
import { ClockCircleOutlined, CalendarOutlined, HeartFilled, LoadingOutlined } from "@ant-design/icons";
import { getMovieById } from "../services/movieService";
import { getShowsByMovie } from "../services/showService";
import { formatTime } from "../utils/dateUtils";

const { Title, Text, Paragraph } = Typography;

export const MovieDetail = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("Today");

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const movieData = await getMovieById(movieId);
        if (!movieData) {
          throw new Error("Movie details not found");
        }
        setMovie(movieData);

        try {
          const showData = await getShowsByMovie(movieId);
          setShows(showData || []);
        } catch (showErr) {
          console.error("Failed to load shows from backend:", showErr);
          setShows([]);
        }
      } catch (err) {
        console.error("Error fetching movie info:", err);
        setError("Failed to retrieve movie details from the database.");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieAndShows();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "500px", background: "#141414" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: "#F84464" }} spin />} />
        <span style={{ color: "#8c8c8c", marginTop: "15px" }}>Loading movie details...</span>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "400px", background: "#141414", padding: "20px" }}>
        <Alert
          message="Connection Error"
          description={error || "Requested movie details are unavailable."}
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

  const defaultPoster = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop";
  const posterSrc = movie.posterUrl || defaultPoster;

  // Filter shows based on date if there are any date selectors.
  // Currently, we will just display all shows returned by the backend.
  const dates = ["Today", "Tomorrow", "Later"];

  return (
    <div style={{ backgroundColor: "#141414", color: "#ffffff", paddingBottom: "50px", minHeight: "100vh" }}>
      
      {/* Hero Movie Banner */}
      <div
        style={{
          position: "relative",
          backgroundImage: `linear-gradient(to right, rgba(20,20,20,0.95) 20%, rgba(20,20,20,0.7) 50%, rgba(20,20,20,0.9) 100%), url(${posterSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "60px 40px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Row gutter={[32, 24]} align="middle">
            <Col xs={24} md={6}>
              <img
                src={posterSrc}
                alt={movie.title}
                style={{ width: "100%", borderRadius: "12px", border: "1px solid #303030", boxShadow: "0 8px 20px rgba(0,0,0,0.5)" }}
              />
            </Col>
            <Col xs={24} md={18}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                <Tag color="#F84464" style={{ border: "none" }}>NOW SHOWING</Tag>
                <Tag color="#333" style={{ border: "none", color: "#fff" }}>{movie.language || "English"}</Tag>
              </div>

              <Title style={{ color: "#ffffff", fontSize: "36px", margin: "0 0 10px 0", fontWeight: "bold" }}>
                {movie.title}
              </Title>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Rate
                    disabled
                    allowHalf
                    value={movie.rating ? movie.rating / 2 : 4.0}
                    style={{ fontSize: "16px", color: "#F84464" }}
                  />
                  <span style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "5px" }}>
                    {movie.rating ? movie.rating.toFixed(1) : "8.0"}/10
                  </span>
                </div>
                <div style={{ color: "#52c41a", display: "flex", alignItems: "center", gap: "4px" }}>
                  <HeartFilled /> 85% liked this
                </div>
              </div>

              {/* Genre, Duration, Release Date metadata */}
              <div style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "25px", color: "#dfdfdf", flexWrap: "wrap" }}>
                <span><ClockCircleOutlined style={{ marginRight: "5px" }} /> {movie.duration || "N/A"} Mins</span>
                <span>•</span>
                <span>{movie.genre || "N/A"}</span>
                <span>•</span>
                <span>Released: {movie.releaseDate ? movie.releaseDate : "N/A"}</span>
              </div>

              {/* View Shows Action Button */}
              <Button
                type="primary"
                size="large"
                icon={<CalendarOutlined />}
                style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold", padding: "0 40px", height: "45px" }}
                onClick={() => navigate(`/movies/${movie.id}/shows`)}
              >
                View Shows
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Synopsis, Credits & Screening Grid */}
      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
        <Row gutter={[32, 32]}>
          
          {/* Main info Col */}
          <Col xs={24} lg={16}>
            <Title level={4} style={{ color: "#ffffff" }}>About the Movie</Title>
            <Paragraph style={{ color: "#a0a0a0", fontSize: "15px", lineHeight: "1.6" }}>
              {movie.description || "No description available for this movie."}
            </Paragraph>

            <Divider style={{ borderColor: "#303030" }} />

            {/* Director */}
            <Title level={4} style={{ color: "#ffffff", marginBottom: "15px" }}>Director</Title>
            {movie.director ? (
              <Space style={{ marginBottom: "20px" }}>
                <Avatar size={60} src={`https://api.dicebear.com/7.x/initials/svg?seed=${movie.director}`} style={{ border: "2px solid #52c41a" }} />
                <div>
                  <div style={{ color: "#fff", fontWeight: "bold", fontSize: "15px" }}>{movie.director}</div>
                  <div style={{ color: "#8c8c8c", fontSize: "12px" }}>Director / Filmmaker</div>
                </div>
              </Space>
            ) : (
              <Empty description="No director info available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}

            <Divider style={{ borderColor: "#303030" }} />

            {/* Cast Members list */}
            <Title level={4} style={{ color: "#ffffff", marginBottom: "20px" }}>Cast Members</Title>
            {movie.castMembers ? (
              <Space size="large" style={{ overflowX: "auto", width: "100%", paddingBottom: "10px" }}>
                {movie.castMembers.split(",").map((name, idx) => (
                  <div key={idx} style={{ textAlign: "center", minWidth: "110px" }}>
                    <Avatar size={70} src={`https://api.dicebear.com/7.x/initials/svg?seed=${name.trim()}`} style={{ border: "2px solid #F84464", marginBottom: "8px" }} />
                    <div style={{ fontSize: "13px", fontWeight: "bold", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100px" }} title={name.trim()}>{name.trim()}</div>
                    <div style={{ fontSize: "11px", color: "#8c8c8c" }}>Actor</div>
                  </div>
                ))}
              </Space>
            ) : (
              <Empty description="No cast information available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Col>

          {/* Showtimes Selection component */}
          <Col xs={24} lg={24} id="showtimes-section" style={{ marginTop: "20px" }}>
            <Card
              title={<span style={{ color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}><CalendarOutlined /> Choose Date & Cinema Showtimes</span>}
              style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030" }}
            >
              <Segmented
                options={dates}
                value={selectedDate}
                onChange={setSelectedDate}
                style={{ backgroundColor: "#141414", color: "#fff", marginBottom: "30px", border: "1px solid #303030" }}
              />

              {shows.length === 0 ? (
                <Empty description="No screenings scheduled for this movie." image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <div>
                  {Array.from(new Set(shows.map(s => s.screen?.theatre?.name || "Theatre"))).map((theatreName) => {
                    const theatreShows = shows.filter(s => (s.screen?.theatre?.name || "Theatre") === theatreName);
                    return (
                      <div key={theatreName} style={{ display: "flex", borderBottom: "1px solid #303030", padding: "20px 0", flexWrap: "wrap", gap: "20px" }}>
                        <div style={{ width: "250px", minWidth: "200px" }}>
                          <Title level={5} style={{ color: "#ffffff", margin: 0 }}>{theatreName}</Title>
                          <Text type="secondary" style={{ fontSize: "12px", color: "#8c8c8c" }}>
                            {theatreShows[0]?.screen?.theatre?.city || ""} • 2D Digital
                          </Text>
                        </div>
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flex: 1 }}>
                          {theatreShows.map((show) => (
                            <Button
                              key={show.id}
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid #434343",
                                color: "#52c41a",
                                height: "45px",
                                fontWeight: "bold"
                              }}
                              onClick={() => navigate(`/booking?showId=${show.id}`)}
                            >
                              {formatTime(show.startTime)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MovieDetail;
