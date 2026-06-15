import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Form, Input, Button, Tabs, Descriptions, Badge, Spin, Alert } from "antd";
import { UserOutlined, EditOutlined, LockOutlined, SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import notificationService from "../utils/notificationService";

const { Title, Text } = Typography;

export const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await userService.getAllUsers();
      const matchedUser = allUsers.find(
        (u) => u.id === user?.id || u.username === user?.username
      );

      if (matchedUser) {
        setProfileData(matchedUser);
        editForm.setFieldsValue({
          firstName: matchedUser.firstName,
          lastName: matchedUser.lastName,
          email: matchedUser.email,
          phoneNumber: matchedUser.phoneNumber,
        });
      } else {
        setError("User profile details could not be resolved from the backend.");
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setError("Failed to connect to the backend server to retrieve profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleUpdateProfile = async (values) => {
    setUpdateLoading(true);
    try {
      // Call update endpoint
      await userService.updateProfile(profileData.id, values);
      notificationService.success(
        "Profile Updated",
        "Your profile details have been successfully saved."
      );
      // Reload profile
      await fetchUserProfile();
    } catch (err) {
      console.error("Profile update failed:", err);
      const errorMsg =
        err.response?.status === 404
          ? "The profile update API endpoint is currently not implemented on the backend."
          : err.response?.data?.message || "Failed to update your profile details.";
      notificationService.error("Update Failed", errorMsg);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      notificationService.error("Validation Error", "New password and confirmation password do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      await userService.changePassword(profileData.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      notificationService.success(
        "Password Changed",
        "Your password has been changed successfully."
      );
      passwordForm.resetFields();
    } catch (err) {
      console.error("Password change failed:", err);
      const errorMsg =
        err.response?.status === 404
          ? "The password change API endpoint is currently not implemented on the backend."
          : err.response?.data?.message || "Failed to update your password.";
      notificationService.error("Password Change Failed", errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "450px",
          background: "#141414",
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: "#F84464" }} spin />} />
        <span style={{ color: "#8c8c8c", marginTop: "15px" }}>Fetching profile details...</span>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#141414", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ borderBottom: "1px solid #303030", paddingBottom: "15px", marginBottom: "30px" }}>
          <Title level={2} style={{ color: "#ffffff", margin: 0, fontWeight: "bold" }}>
            User Profile Settings
          </Title>
          <Text type="secondary" style={{ color: "#8c8c8c" }}>
            View and manage your account settings, personal details, and security options.
          </Text>
        </div>

        {error && (
          <Alert
            message="Profile Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}>
              <Tabs
                defaultActiveKey="overview"
                className="dark-tabs"
                items={[
                  // Overview Tab
                  {
                    key: "overview",
                    label: (
                      <span style={{ color: "#fff", fontSize: "16px" }}>
                        <UserOutlined /> Overview
                      </span>
                    ),
                    children: (
                      <div style={{ paddingTop: "15px" }}>
                        <Descriptions
                          bordered
                          column={{ xs: 1, sm: 2 }}
                          size="middle"
                          style={{ background: "#141414", borderRadius: "8px", overflow: "hidden" }}
                          contentStyle={{ color: "#ffffff", backgroundColor: "#1f1f1f", borderColor: "#303030" }}
                          labelStyle={{ color: "#8c8c8c", backgroundColor: "#141414", borderColor: "#303030", fontWeight: "bold" }}
                        >
                          <Descriptions.Item label="Username">
                            {profileData?.username}
                          </Descriptions.Item>
                          <Descriptions.Item label="Role">
                            <Badge status="processing" text={profileData?.role} style={{ color: "#fff" }} />
                          </Descriptions.Item>
                          <Descriptions.Item label="First Name">
                            {profileData?.firstName || "N/A"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Last Name">
                            {profileData?.lastName || "N/A"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Email">
                            {profileData?.email}
                          </Descriptions.Item>
                          <Descriptions.Item label="Phone Number">
                            {profileData?.phoneNumber || "N/A"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Account Status">
                            <Badge
                              status={profileData?.enabled ? "success" : "error"}
                              text={profileData?.enabled ? "Active" : "Disabled"}
                              style={{ color: "#fff" }}
                            />
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    ),
                  },
                  // Edit Profile Tab
                  {
                    key: "edit",
                    label: (
                      <span style={{ color: "#fff", fontSize: "16px" }}>
                        <EditOutlined /> Edit Profile
                      </span>
                    ),
                    children: (
                      <Form
                        form={editForm}
                        layout="vertical"
                        onFinish={handleUpdateProfile}
                        style={{ paddingTop: "20px" }}
                      >
                        <Row gutter={16}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              name="firstName"
                              label={<span style={{ color: "#fff" }}>First Name</span>}
                              rules={[{ required: true, message: "First name is required." }]}
                            >
                              <Input style={{ backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              name="lastName"
                              label={<span style={{ color: "#fff" }}>Last Name</span>}
                              rules={[{ required: true, message: "Last name is required." }]}
                            >
                              <Input style={{ backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }} />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          name="email"
                          label={<span style={{ color: "#fff" }}>Email Address</span>}
                          rules={[
                            { required: true, message: "Email is required." },
                            { type: "email", message: "Enter a valid email address." },
                          ]}
                        >
                          <Input style={{ backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }} />
                        </Form.Item>

                        <Form.Item
                          name="phoneNumber"
                          label={<span style={{ color: "#fff" }}>Phone Number</span>}
                        >
                          <Input style={{ backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }} />
                        </Form.Item>

                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={updateLoading}
                            style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
                          >
                            Save Changes
                          </Button>
                        </Form.Item>
                      </Form>
                    ),
                  },
                  // Change Password Tab
                  {
                    key: "security",
                    label: (
                      <span style={{ color: "#fff", fontSize: "16px" }}>
                        <LockOutlined /> Change Password
                      </span>
                    ),
                    children: (
                      <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handleChangePassword}
                        style={{ paddingTop: "20px" }}
                      >
                        <Form.Item
                          name="currentPassword"
                          label={<span style={{ color: "#fff" }}>Current Password</span>}
                          rules={[{ required: true, message: "Current password is required." }]}
                        >
                          <Input.Password style={{ backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }} />
                        </Form.Item>

                        <Form.Item
                          name="newPassword"
                          label={<span style={{ color: "#fff" }}>New Password</span>}
                          rules={[
                            { required: true, message: "New password is required." },
                            { min: 6, message: "Password must be at least 6 characters." },
                          ]}
                        >
                          <Input.Password style={{ backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }} />
                        </Form.Item>

                        <Form.Item
                          name="confirmPassword"
                          label={<span style={{ color: "#fff" }}>Confirm New Password</span>}
                          rules={[{ required: true, message: "Confirm password is required." }]}
                        >
                          <Input.Password style={{ backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }} />
                        </Form.Item>

                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<LockOutlined />}
                            loading={passwordLoading}
                            style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
                          >
                            Update Password
                          </Button>
                        </Form.Item>
                      </Form>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;
