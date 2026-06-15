import React, { useState } from "react";
import { Form, Input, Button, Card, Alert, Typography, message, Spin, Select } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, SolutionOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import notificationService from "../utils/notificationService";

const { Title, Text } = Typography;

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setErrorMsg("");
    setLoading(true);
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        role: values.role || "CUSTOMER",
      });
      notificationService.success("Registration Successful", "Welcome to MovieHub! Please log in to continue.");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      const errMsg = err.response?.data?.message || "Registration failed. Username or email may already be taken.";
      setErrorMsg(errMsg);
      notificationService.error("Registration Failed", errMsg);
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
        padding: "20px 10px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#1f1f1f",
          border: "1px solid #303030",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <Title level={2} style={{ color: "#F84464", margin: 0, fontWeight: "bold" }}>
            Create Account
          </Title>
          <Text type="secondary" style={{ color: "#8c8c8c" }}>
            Join MovieHub and enjoy seamless ticket bookings.
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
          name="register_form"
          onFinish={onFinish}
          layout="vertical"
          size="middle"
          disabled={loading}
        >
          {/* First Name & Last Name Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Form.Item
              name="firstName"
              label={<span style={{ color: "#dfdfdf" }}>First Name</span>}
              rules={[{ required: true, message: "Please input first name!" }]}
            >
              <Input
                prefix={<SolutionOutlined style={{ color: "#8c8c8c" }} />}
                placeholder="John"
                style={{ backgroundColor: "#141414", border: "1px solid #303030", color: "#fff" }}
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={<span style={{ color: "#dfdfdf" }}>Last Name</span>}
              rules={[{ required: true, message: "Please input last name!" }]}
            >
              <Input
                prefix={<SolutionOutlined style={{ color: "#8c8c8c" }} />}
                placeholder="Doe"
                style={{ backgroundColor: "#141414", border: "1px solid #303030", color: "#fff" }}
              />
            </Form.Item>
          </div>

          {/* Username */}
          <Form.Item
            name="username"
            label={<span style={{ color: "#dfdfdf" }}>Username</span>}
            rules={[
              { required: true, message: "Please input username!" },
              { min: 3, message: "Username must be at least 3 characters!" }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="johndoe123"
              style={{ backgroundColor: "#141414", border: "1px solid #303030", color: "#fff" }}
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label={<span style={{ color: "#dfdfdf" }}>Email Address</span>}
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="john@example.com"
              style={{ backgroundColor: "#141414", border: "1px solid #303030", color: "#fff" }}
            />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            name="phoneNumber"
            label={<span style={{ color: "#dfdfdf" }}>Phone Number</span>}
            rules={[
              { required: true, message: "Please input phone number!" },
              { pattern: /^\d{10}$/, message: "Must be a valid 10-digit number!" },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="9876543210"
              style={{ backgroundColor: "#141414", border: "1px solid #303030", color: "#fff" }}
            />
          </Form.Item>

          {/* Account Role */}
          <Form.Item
            name="role"
            label={<span style={{ color: "#dfdfdf" }}>Register As</span>}
            rules={[{ required: true, message: "Please select account role!" }]}
            initialValue="CUSTOMER"
          >
            <Select style={{ width: "100%" }} dropdownStyle={{ backgroundColor: "#1f1f1f" }}>
              <Select.Option value="CUSTOMER">Customer</Select.Option>
              <Select.Option value="THEATRE_OWNER">Theatre Owner</Select.Option>
            </Select>
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label={<span style={{ color: "#dfdfdf" }}>Password</span>}
            rules={[
              { required: true, message: "Please input password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="Minimum 6 characters"
              style={{ backgroundColor: "#141414", border: "1px solid #303030", color: "#fff" }}
            />
          </Form.Item>

          {/* Confirm Password with match check */}
          <Form.Item
            name="confirmPassword"
            label={<span style={{ color: "#dfdfdf" }}>Confirm Password</span>}
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords that you entered do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="Re-enter password"
              style={{ backgroundColor: "#141414", border: "1px solid #303030", color: "#fff" }}
            />
          </Form.Item>

          {/* Signup button */}
          <Form.Item style={{ marginTop: "24px" }}>
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
              {loading ? "Registering..." : "Sign Up"}
            </Button>
          </Form.Item>
        </Form>

        {/* Back to login */}
        <div style={{ textAlign: "center", marginTop: "15px", color: "#8c8c8c" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#F84464", fontWeight: "bold" }}>
            Login Here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;