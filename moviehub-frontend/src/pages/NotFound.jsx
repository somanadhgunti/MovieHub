import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", backgroundColor: "#141414" }}>
      <Result
        status="404"
        title={<span style={{ color: "#ffffff" }}>404 - Resource Not Found</span>}
        subTitle={<span style={{ color: "#8c8c8c" }}>The requested URL / path is not mapped to any known node.</span>}
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/home")}
            style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
          >
            Back to Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
