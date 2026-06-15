import React, { useEffect, useState } from "react";
import { Carousel, Typography, Row, Col, Space, Button, Card, Spin, Alert, Empty } from "antd";
import { PlayCircleOutlined, FireOutlined, LoadingOutlined } from "@ant-design/icons";
import { getAllMovies } from "../services/movieService";
import MovieCard from "../components/customer/MovieCard";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

export const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMovies();
      setMovies(data || []);
    } catch (err) {
      console.error("Failed to fetch homepage movies:", err);
      setError("Failed to reach backend database services.");
    } finally {
      setLoading(false);
    }
  };

  // Generate banners dynamically from the loaded movies
  const carouselBanners = movies.slice(0, 3).map((m) => ({
    id: m.id,
    image: m.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    title: m.title,
    description: m.description || "Experience this cinematic masterpiece in premium comfort theaters near you.",
  }));

  // Default banner if no movies are loaded
  const defaultBanners = [
    {
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
      title: "Welcome to MovieHub",
      description: "Book tickets for the latest blockbusters and enjoy immersive cinema screens near you.",
    }
  ];

  const activeBanners = carouselBanners.length > 0 ? carouselBanners : defaultBanners;

  return (
    <div style={{ backgroundColor: "#141414", minHeight: "100vh", paddingBottom: "50px" }}>
      
      {/* Visual Carousel Banners */}
      <Carousel autoplay effect="fade" style={{ marginBottom: "40px" }}>
        {activeBanners.map((banner, index) => (
          <div key={index} style={{ position: "relative", height: "450px", width: "100%" }}>
            {/* Background image overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `linear-gradient(to right, rgba(20,20,20,1) 15%, rgba(20,20,20,0.4) 60%, rgba(20,20,20,0.8) 100%), url(${banner.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Banner Text Container */}
            <div style={{ position: "absolute", bottom: "60px", left: "80px", maxWidth: "550px", zIndex: 5, color: "#fff" }}>
              <Title style={{ color: "#ffffff", fontSize: "36px", fontWeight: "bold", marginBottom: "10px" }}>
                {banner.title}
              </Title>
              <Paragraph style={{ color: "#dfdfdf", fontSize: "16px", marginBottom: "20px" }}>
                {banner.description}
              </Paragraph>
              <Space size="middle">
                {banner.id && (
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<PlayCircleOutlined />} 
                    style={{ backgroundColor: "#F84464", borderColor: "#F84464" }}
                    onClick={() => navigate(`/movies/${banner.id}`)}
                  >
                    View Details
                  </Button>
                )}
                <Button 
                  size="large" 
                  style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "none", color: "#fff" }}
                  onClick={() => navigate("/movies")}
                >
                  Explore Catalog
                </Button>
              </Space>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Movies Content Section */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* Promotional Offers Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: "40px" }}>
          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{
                background: "linear-gradient(135deg, #f5222d 0%, #722ed1 100%)",
                border: "none",
                borderRadius: "8px"
              }}
            >
              <h2 style={{ color: "#fff", margin: 0, fontWeight: "bold" }}>UP TO 50% OFF</h2>
              <p style={{ color: "#dfdfdf", marginBottom: "15px" }}>Book tickets using credit cards and avail instant cashbacks.</p>
              <Button type="default" size="small" style={{ color: "#f5222d", fontWeight: "bold", border: "none" }}>CLAIM OFFER</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              hoverable
              style={{
                background: "linear-gradient(135deg, #1890ff 0%, #13c2c2 100%)",
                border: "none",
                borderRadius: "8px"
              }}
            >
              <h2 style={{ color: "#fff", margin: 0, fontWeight: "bold" }}>FREE MOVIE SNACKS</h2>
              <p style={{ color: "#dfdfdf", marginBottom: "15px" }}>Pre-book combo popcorn and soft drink to get premium lounge discount.</p>
              <Button type="default" size="small" style={{ color: "#1890ff", fontWeight: "bold", border: "none" }}>PRE-ORDER NOW</Button>
            </Card>
          </Col>
        </Row>

        {/* Section title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid #303030", paddingBottom: "10px" }}>
          <Title level={3} style={{ color: "#ffffff", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <FireOutlined style={{ color: "#F84464" }} /> Recommended Movies
          </Title>
          <Button type="link" onClick={() => navigate("/movies")} style={{ color: "#F84464", padding: 0 }}>See All</Button>
        </div>

        {/* Movie Listing grid */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "200px", alignItems: "center" }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: "#F84464" }} />} />
            <Text type="secondary" style={{ color: "#8c8c8c", marginTop: "15px" }}>Syncing available titles...</Text>
          </div>
        ) : error ? (
          <Alert message="Connection Error" description={error} type="error" showIcon />
        ) : movies.length === 0 ? (
          <Empty description="No movies are currently loaded in the database." image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Row gutter={[24, 24]}>
            {movies.map((movie) => (
              <Col key={movie.id} xs={24} sm={12} md={8} lg={6} style={{ display: "flex", justifyContent: "center" }}>
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Home;