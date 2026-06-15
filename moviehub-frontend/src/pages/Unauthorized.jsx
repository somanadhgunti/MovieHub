import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", backgroundColor: "#141414" }}>
      <Result
        status="403"
        title={<span style={{ color: "#ffffff" }}>403 - Unauthorized Access</span>}
        subTitle={<span style={{ color: "#8c8c8c" }}>You do not possess the required authorization tokens to access this node.</span>}
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/home")}
            style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
          >
            Return Home
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;
