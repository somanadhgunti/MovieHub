import React, { useEffect, useState } from "react";
import { Table, Button, Space, Card, Switch, Input, Select, message, Spin, Alert, Typography, Tag } from "antd";
import { SearchOutlined, LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { getAllUsers, updateUserStatus } from "../services/userService";
import notificationService from "../utils/notificationService";

const { Option } = Select;
const { Title, Text } = Typography;

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to fetch registered users list from database.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (checked, record) => {
    setUpdatingId(record.id);
    try {
      await updateUserStatus(record.id, checked);
      notificationService.success(
        "User Status Updated",
        `User "${record.username}" has been ${checked ? "enabled" : "disabled"} successfully.`
      );
      loadUsers();
    } catch (err) {
      console.error("Failed to update status:", err);
      notificationService.error("Status Update Failed", err.response?.data?.message || "Failed to update user status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter pipeline
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      title: "Name",
      key: "fullName",
      render: (_, record) => (
        <span style={{ fontWeight: "bold", color: "#fff" }}>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <span style={{ fontFamily: "monospace", color: "#dfdfdf" }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "ADMIN" ? "red" : role === "THEATRE_OWNER" ? "blue" : "default"}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tag color={record.enabled ? "green" : "red"}>
          {record.enabled ? "ACTIVE" : "DISABLED"}
        </Tag>
      ),
    },
    {
      title: "Enable / Disable",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Switch
          checked={record.enabled}
          loading={updatingId === record.id}
          onChange={(checked) => handleStatusChange(checked, record)}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
        />
      ),
    },
  ];

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert message="Connection Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div>
      <Card
        title={
          <span style={{ color: "#fff" }}>
            <Title level={4} style={{ color: "#fff", margin: 0 }}>
              <UserOutlined style={{ marginRight: "10px", color: "#F84464" }} />
              User Accounts Management
            </Title>
          </span>
        }
        style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}
      >
        {/* Search and filter toolbar */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
          <Input
            placeholder="Search by name, username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
            style={{ width: "300px", backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }}
          />

          <Select
            value={selectedRole}
            onChange={setSelectedRole}
            style={{ width: "200px" }}
            dropdownStyle={{ backgroundColor: "#1f1f1f" }}
          >
            <Option value="ALL">All Roles</Option>
            <Option value="CUSTOMER">Customer</Option>
            <Option value="THEATRE_OWNER">Theatre Owner</Option>
            <Option value="ADMIN">Admin</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading ? { indicator: <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: "#F84464" }} />} /> } : false}
          scroll={{ x: 800 }}
          className="dark-table"
        />
      </Card>
    </div>
  );
};

export default AdminUsers;
