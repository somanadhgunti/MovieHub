import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Card, Rate, Button, Typography, Breadcrumb, Tag, Spin, Alert, Empty, Input, Select } from "antd";
import { VideoCameraOutlined, ClockCircleOutlined, GlobalOutlined, LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllMovies } from "../services/movieService";

const { Title, Text } = Typography;
const { Option } = Select;

export const Movies = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search") || "";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, filtering, and sorting states
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedGenre, setSelectedGenre] = useState("ALL");
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [sortBy, setSortBy] = useState("NONE");

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllMovies();
        setMovies(data || []);
      } catch (err) {
        console.error("Failed to load movies catalog:", err);
        setError("Failed to fetch running movies from the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Extract unique genres and languages dynamically from backend movies list
  const genresList = ["ALL", ...Array.from(new Set(movies.map((m) => m.genre).filter(Boolean)))];
  const languagesList = ["ALL", ...Array.from(new Set(movies.map((m) => m.language).filter(Boolean)))];

  // 1. Filter pipeline
  let displayedMovies = movies;

  // Title Search
  if (localSearch) {
    displayedMovies = displayedMovies.filter((m) =>
      m.title.toLowerCase().includes(localSearch.toLowerCase())
    );
  }

  // Genre Filter
  if (selectedGenre !== "ALL") {
    displayedMovies = displayedMovies.filter((m) => m.genre === selectedGenre);
  }

  // Language Filter
  if (selectedLanguage !== "ALL") {
    displayedMovies = displayedMovies.filter((m) => m.language === selectedLanguage);
  }

  // 2. Sort pipeline
  if (sortBy === "RATING_DESC") {
    displayedMovies = [...displayedMovies].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === "DATE_DESC") {
    displayedMovies = [...displayedMovies].sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
  } else if (sortBy === "DATE_ASC") {
    displayedMovies = [...displayedMovies].sort((a, b) => new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0));
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "450px", background: "#141414" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: "#F84464" }} spin />} />
        <span style={{ color: "#8c8c8c", marginTop: "15px" }}>Fetching Movies list...</span>
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
    <div style={{ backgroundColor: "#141414", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Navigation Breadcrumb */}
        <Breadcrumb
          style={{ marginBottom: "25px" }}
          items={[
            { title: <Link to="/home" style={{ color: "#8c8c8c" }}>Home</Link> },
            { title: <span style={{ color: "#ffffff" }}>Movies</span> }
          ]}
        />

        <div style={{ borderBottom: "1px solid #303030", paddingBottom: "15px", marginBottom: "30px" }}>
          <Title level={2} style={{ color: "#ffffff", margin: 0 }}>
            Explore Movies Catalog
          </Title>
          <Text type="secondary" style={{ color: "#8c8c8c" }}>
            Explore the latest running titles and customize search results.
          </Text>
        </div>

        {/* Filter and Search Bar Card */}
        <Card 
          style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px", marginBottom: "30px" }} 
          bodyStyle={{ padding: "16px" }}
        >
          <Row gutter={[16, 16]} align="middle">
            {/* Title Search */}
            <Col xs={24} sm={8} md={6}>
              <Input
                placeholder="Search by Title..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                allowClear
                prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
                style={{ backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }}
              />
            </Col>
            
            {/* Genre Filter */}
            <Col xs={12} sm={8} md={6}>
              <Select
                value={selectedGenre}
                onChange={setSelectedGenre}
                style={{ width: "100%" }}
                dropdownStyle={{ backgroundColor: "#1f1f1f" }}
                placeholder="Filter Genre"
              >
                {genresList.map((g) => (
                  <Option key={g} value={g}>{g === "ALL" ? "All Genres" : g}</Option>
                ))}
              </Select>
            </Col>
            
            {/* Language Filter */}
            <Col xs={12} sm={8} md={6}>
              <Select
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                style={{ width: "100%" }}
                dropdownStyle={{ backgroundColor: "#1f1f1f" }}
                placeholder="Filter Language"
              >
                {languagesList.map((l) => (
                  <Option key={l} value={l}>{l === "ALL" ? "All Languages" : l}</Option>
                ))}
              </Select>
            </Col>
            
            {/* Sorting */}
            <Col xs={24} sm={24} md={6}>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: "100%" }}
                dropdownStyle={{ backgroundColor: "#1f1f1f" }}
                placeholder="Sort By"
              >
                <Option value="NONE">Default Sorting</Option>
                <Option value="RATING_DESC">Rating (High to Low)</Option>
                <Option value="DATE_DESC">Release Date (Newest First)</Option>
                <Option value="DATE_ASC">Release Date (Oldest First)</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {displayedMovies.length === 0 ? (
          <Empty 
            description="No movie matches found. Try modifying your search or filters!" 
            style={{ padding: "60px 0" }} 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Row gutter={[24, 24]}>
            {displayedMovies.map((movie) => {
              const defaultPoster = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop";
              const posterSrc = movie.posterUrl || defaultPoster;

              return (
                <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    style={{
                      backgroundColor: "#1f1f1f",
                      border: "1px solid #303030",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                    bodyStyle={{ padding: "16px", backgroundColor: "#1f1f1f" }}
                    cover={
                      <div style={{ height: "320px", overflow: "hidden" }}>
                        <img
                          alt={movie.title}
                          src={posterSrc}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        />
                      </div>
                    }
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      
                      {/* Movie Title */}
                      <Title
                        level={5}
                        ellipsis={{ rows: 1 }}
                        style={{ color: "#ffffff", margin: 0, fontWeight: "bold", fontSize: "16px" }}
                      >
                        {movie.title}
                      </Title>

                      {/* Ratings */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Rate
                          disabled
                          allowHalf
                          value={movie.rating ? movie.rating / 2 : 4.0}
                          style={{ fontSize: "13px", color: "#F84464" }}
                        />
                        <Text style={{ color: "#dfdfdf", fontSize: "12px", fontWeight: "bold" }}>
                          {movie.rating ? movie.rating.toFixed(1) : "8.0"}
                        </Text>
                      </div>

                      {/* Movie Genres & Language tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        <Tag color="#333" style={{ border: "none", color: "#dfdfdf" }}>
                          <VideoCameraOutlined style={{ marginRight: "3px" }} />
                          {movie.genre || "N/A"}
                        </Tag>
                        <Tag color="#333" style={{ border: "none", color: "#dfdfdf" }}>
                          <GlobalOutlined style={{ marginRight: "3px" }} />
                          {movie.language || "N/A"}
                        </Tag>
                      </div>

                      {/* Duration */}
                      <Text type="secondary" style={{ fontSize: "12px", color: "#8c8c8c" }}>
                        <ClockCircleOutlined style={{ marginRight: "4px" }} />
                        {movie.duration || 0} Minutes
                      </Text>

                      {/* View Details Redirect CTA Button */}
                      <Button
                        type="primary"
                        onClick={() => navigate(`/movies/${movie.id}`)}
                        style={{
                          backgroundColor: "#F84464",
                          borderColor: "#F84464",
                          fontWeight: "bold",
                          marginTop: "8px"
                        }}
                      >
                        View Details
                      </Button>

                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Movies;
