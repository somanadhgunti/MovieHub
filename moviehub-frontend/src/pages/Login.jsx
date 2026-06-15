import React, { useState } from "react";
import { Form, Input, Button, Card, Alert, Typography, Spin } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import notificationService from "../utils/notificationService";

const { Title, Text } = Typography;

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/home";

  const onFinish = async (values) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const user = await login(values.username, values.password);
      notificationService.success("Login Successful", `Welcome back, ${user.firstName || user.username}!`);
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "THEATRE_OWNER") {
        navigate("/owner/dashboard", { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      console.error("Login failure:", err);
      const errMsg = err.response?.data?.message || "Invalid username or password. Please try again.";
      setErrorMsg(errMsg);
      notificationService.error("Login Failed", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#141414",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#1f1f1f",
          border: "1px solid #303030",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <Title level={2} style={{ color: "#F84464", margin: 0, fontWeight: "bold" }}>
            MovieHub
          </Title>
          <Text type="secondary" style={{ color: "#8c8c8c" }}>
            Welcome back! Please login to your account.
          </Text>
        </div>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            style={{
              marginBottom: "20px",
              backgroundColor: "#2a1215",
              border: "1px solid #5c1d24",
              color: "#ff4d4f",
            }}
          />
        )}

        <Form
          name="login_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          disabled={loading}
        >
          <Form.Item
            name="username"
            label={<span style={{ color: "#dfdfdf" }}>Username / Email</span>}
            rules={[
              { required: true, message: "Please input your Username or Email!" },
              { min: 3, message: "Username must be at least 3 characters!" }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="Enter Username"
              style={{ backgroundColor: "#141414", border: "1px solid #303030", color: "#fff" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: "#dfdfdf" }}>Password</span>}
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 6, message: "Password must be at least 6 characters!" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="Enter Password"
              style={{ backgroundColor: "#141414", border: "1px solid #303030", color: "#fff" }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "12px", marginTop: "24px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 18, color: '#fff' }} spin />} /> : null}
              style={{
                width: "100%",
                backgroundColor: "#F84464",
                borderColor: "#F84464",
                fontWeight: "bold",
                height: "45px"
              }}
            >
              {loading ? "Authenticating..." : "Log in"}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: "15px", color: "#8c8c8c" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#F84464", fontWeight: "bold" }}>
            Register Now
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;