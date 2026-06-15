import React from "react";
import { Card, Tag, Typography } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // Helper to fallback to standard movie posters if posterUrl is not present
  const defaultPoster = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop";
  const posterSrc = movie.posterUrl || defaultPoster;

  return (
    <Card
      hoverable
      style={{
        width: 240,
        backgroundColor: "#1f1f1f",
        border: "1px solid #303030",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
      }}
      bodyStyle={{ padding: "12px", backgroundColor: "#1f1f1f" }}
      cover={
        <div style={{ position: "relative", height: "340px", overflow: "hidden" }} className="movie-poster-container">
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
          
          {/* Ratings overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "14px" }}>
              <StarFilled style={{ color: "#F84464", marginRight: "5px" }} />
              {movie.rating ? movie.rating.toFixed(1) : "N/A"}/10
            </span>
            <span style={{ color: "#8c8c8c", fontSize: "12px" }}>votes</span>
          </div>
        </div>
      }
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <Title
          level={5}
          ellipsis={{ rows: 1 }}
          style={{ color: "#ffffff", margin: "0 0 4px 0", fontSize: "16px", fontWeight: "bold" }}
        >
          {movie.title}
        </Title>
        
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "4px" }}>
          <Tag color="#2b2b2b" style={{ color: "#dfdfdf", border: "none" }}>{movie.language}</Tag>
          <Tag color="#2b2b2b" style={{ color: "#dfdfdf", border: "none" }}>{movie.genre}</Tag>
        </div>

        <Text type="secondary" style={{ fontSize: "12px" }}>
          {movie.duration} mins • {movie.director}
        </Text>
      </div>
    </Card>
  );
};

export default MovieCard;
