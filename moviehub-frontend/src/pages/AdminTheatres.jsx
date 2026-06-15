import React, { useEffect, useState } from "react";
import { Table, Button, Space, Drawer, Form, Input, InputNumber, Select, message, Card, Popconfirm, Spin, Alert, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { getAllTheatres, createTheatre, updateTheatre, deleteTheatre } from "../services/theatreService";

const { Option } = Select;
const { Title } = Typography;

export const AdminTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTheatres();
  }, []);

  const loadTheatres = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTheatres();
      setTheatres(data || []);
    } catch (err) {
      console.error("Failed to load theatres:", err);
      setError("Failed to fetch theatres list from backend database.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (theatre = null) => {
    setEditingTheatre(theatre);
    if (theatre) {
      form.setFieldsValue(theatre);
    } else {
      form.resetFields();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTheatre(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingTheatre) {
        await updateTheatre(editingTheatre.id, values);
        message.success("Theatre updated successfully!");
      } else {
        await createTheatre(values);
        message.success("Theatre created successfully!");
      }
      loadTheatres();
      handleClose();
    } catch (err) {
      console.error("Failed to save theatre:", err);
      message.error("Failed to save theatre details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTheatre(id);
      message.success("Theatre deleted successfully!");
      loadTheatres();
    } catch (err) {
      console.error("Failed to delete theatre:", err);
      message.error("Failed to delete theatre from database. Check for dependencies.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{ fontWeight: "bold", color: "#fff" }}>{text}</span>,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Zip Code",
      dataIndex: "zipCode",
      key: "zipCode",
    },
    {
      title: "Contact",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Screens",
      dataIndex: "totalScreens",
      key: "totalScreens",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "ACTIVE" ? "green" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpen(record)}
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete theatre?"
            description="All screens and shows will be affected."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, style: { fontWeight: "bold" } }}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
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
        title={<span style={{ color: "#fff" }}><Title level={4} style={{ color: "#fff", margin: 0 }}>Theatre Management</Title></span>}
        style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpen()}
            style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
          >
            Add Theatre
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={theatres}
          rowKey="id"
          loading={loading ? { indicator: <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: "#F84464" }} />} /> } : false}
          scroll={{ x: 800 }}
          className="dark-table"
        />
      </Card>

      {/* Theatre Drawer */}
      <Drawer
        title={<span style={{ color: "#fff" }}>{editingTheatre ? "Edit Theatre Details" : "Add New Theatre"}</span>}
        placement="right"
        width={450}
        onClose={handleClose}
        open={open}
        bodyStyle={{ backgroundColor: "#141414" }}
        headerStyle={{ backgroundColor: "#1f1f1f", borderBottom: "1px solid #303030" }}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleClose} style={{ marginRight: 8, backgroundColor: "transparent", color: "#8c8c8c" }}>
              Cancel
            </Button>
            <Button
              type="primary"
              loading={submitting}
              onClick={() => form.submit()}
              style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
            >
              Save Theatre
            </Button>
          </div>
        }
        footerStyle={{ backgroundColor: "#1f1f1f", borderTop: "1px solid #303030" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={<span style={{ color: "#fff" }}>Theatre Name</span>}
            rules={[{ required: true, message: "Please enter the theatre name" }]}
          >
            <Input style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
          </Form.Item>

          <Form.Item
            name="address"
            label={<span style={{ color: "#fff" }}>Address</span>}
            rules={[{ required: true, message: "Please enter location address" }]}
          >
            <Input.TextArea style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} rows={2} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="city"
                label={<span style={{ color: "#fff" }}>City</span>}
                rules={[{ required: true, message: "Please specify city" }]}
              >
                <Input style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="state"
                label={<span style={{ color: "#fff" }}>State</span>}
                rules={[{ required: true, message: "Please specify state" }]}
              >
                <Input style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="zipCode"
                label={<span style={{ color: "#fff" }}>Zip Code</span>}
              >
                <Input style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="totalScreens"
                label={<span style={{ color: "#fff" }}>Total Screens</span>}
                rules={[{ required: true, message: "Please enter count of screens" }]}
              >
                <InputNumber style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label={<span style={{ color: "#fff" }}>Phone Number</span>}
              >
                <Input style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={<span style={{ color: "#fff" }}>Status</span>}
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select style={{ width: "100%" }} dropdownStyle={{ backgroundColor: "#1f1f1f" }}>
                  <Option value="ACTIVE">ACTIVE</Option>
                  <Option value="INACTIVE">INACTIVE</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label={<span style={{ color: "#fff" }}>Email Address</span>}
          >
            <Input placeholder="manager@cinema.com" style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
          </Form.Item>

          <Form.Item
            name="amenities"
            label={<span style={{ color: "#fff" }}>Amenities (Comma Separated)</span>}
          >
            <Input.TextArea placeholder="IMAX, 4K Projection, Recliners, Food Court" style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} rows={2} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default AdminTheatres;
import { Tag } from "antd";
