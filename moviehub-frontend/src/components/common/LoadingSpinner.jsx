import React from "react";
import { Spin } from "antd";

export const LoadingSpinner = ({ tip = "Loading...", fullScreen = false }) => {
  const spinnerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: fullScreen ? "100vh" : "200px",
    background: fullScreen ? "#141414" : "transparent",
  };

  return (
    <div style={spinnerStyle}>
      <Spin size="large" tip={tip} style={{ color: "#F84464" }} />
    </div>
  );
};

export default LoadingSpinner;
