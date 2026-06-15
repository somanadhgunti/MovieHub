import React, { useEffect, useState } from "react";
import { Table, Button, Space, Drawer, Form, Input, InputNumber, Select, message, Card, Popconfirm, Spin, Alert, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { getAllScreens, createScreen, updateScreen, deleteScreen, getAllTheatres } from "../services/theatreService";

const { Option } = Select;
const { Title } = Typography;

export const AdminScreens = () => {
  const [screens, setScreens] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const screensData = await getAllScreens();
      setScreens(screensData || []);

      const theatresData = await getAllTheatres();
      setTheatres(theatresData || []);
    } catch (err) {
      console.error("Failed to load screen management data:", err);
      setError("Failed to fetch screen configurations and theatre catalog.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (screen = null) => {
    setEditingScreen(screen);
    if (screen) {
      form.setFieldsValue({
        ...screen,
        theatreId: screen.theatre?.id,
      });
    } else {
      form.resetFields();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingScreen(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingScreen) {
        await updateScreen(editingScreen.id, values);
        message.success("Screen configuration updated successfully!");
      } else {
        await createScreen(values);
        message.success("Screen created successfully!");
      }
      loadData();
      handleClose();
    } catch (err) {
      console.error("Failed to save screen:", err);
      message.error("Failed to save screen details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteScreen(id);
      message.success("Screen deleted successfully!");
      loadData();
    } catch (err) {
      console.error("Failed to delete screen:", err);
      message.error("Failed to delete screen from database. Check for scheduled show dependencies.");
    }
  };

  const columns = [
    {
      title: "Screen Name / No",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <span style={{ fontWeight: "bold", color: "#fff" }}>{text || `Audi ${record.screenNumber}`}</span>,
    },
    {
      title: "Theatre Cinema",
      dataIndex: ["theatre", "name"],
      key: "theatreName",
      render: (name) => <span style={{ color: "#dfdfdf" }}>{name || "N/A"}</span>,
    },
    {
      title: "Screen Type",
      dataIndex: "screenType",
      key: "screenType",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Dimensions (Rows x Cols)",
      key: "dimensions",
      render: (_, record) => <span>{record.totalRows} Rows x {record.totalColumns} Cols</span>,
    },
    {
      title: "Total Capacity",
      dataIndex: "totalSeats",
      key: "totalSeats",
      align: "center",
      render: (seats) => <span style={{ fontWeight: "bold", color: "#faad14" }}>{seats} Seats</span>,
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
            title="Delete screen?"
            description="All scheduled shows and layouts on this screen will be lost."
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
        title={<span style={{ color: "#fff" }}><Title level={4} style={{ color: "#fff", margin: 0 }}>Screen Management</Title></span>}
        style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpen()}
            style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
          >
            Add Screen
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={screens}
          rowKey="id"
          loading={loading ? { indicator: <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: "#F84464" }} />} /> } : false}
          scroll={{ x: 800 }}
          className="dark-table"
        />
      </Card>

      {/* Screen Drawer */}
      <Drawer
        title={<span style={{ color: "#fff" }}>{editingScreen ? "Edit Screen Details" : "Add New Screen"}</span>}
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
              Save Screen
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
            name="theatreId"
            label={<span style={{ color: "#fff" }}>Assign Theatre</span>}
            rules={[{ required: true, message: "Please select the cinema theatre" }]}
          >
            <Select style={{ width: "100%" }} dropdownStyle={{ backgroundColor: "#1f1f1f" }}>
              {theatres.map((t) => (
                <Option key={t.id} value={t.id}>{t.name} ({t.city})</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label={<span style={{ color: "#fff" }}>Screen Name</span>}
            rules={[{ required: true, message: "Please enter the screen name" }]}
          >
            <Input placeholder="IMAX Hall / Screen 1" style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="screenNumber"
                label={<span style={{ color: "#fff" }}>Screen Number</span>}
                rules={[{ required: true, message: "Please enter number ID" }]}
              >
                <InputNumber style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="screenType"
                label={<span style={{ color: "#fff" }}>Screen Projection Type</span>}
                rules={[{ required: true, message: "Please select type" }]}
              >
                <Select style={{ width: "100%" }} dropdownStyle={{ backgroundColor: "#1f1f1f" }}>
                  <Option value="TWO_D">2D Digital</Option>
                  <Option value="THREE_D">3D Stereoscopic</Option>
                  <Option value="IMAX">IMAX Theater</Option>
                  <Option value="FOUR_DX">4DX Motion</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="totalRows"
                label={<span style={{ color: "#fff" }}>Total Rows</span>}
                rules={[{ required: true, message: "Rows count" }]}
              >
                <InputNumber style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} min={1} max={26} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalColumns"
                label={<span style={{ color: "#fff" }}>Total Cols</span>}
                rules={[{ required: true, message: "Cols count" }]}
              >
                <InputNumber style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} min={1} max={30} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalSeats"
                label={<span style={{ color: "#fff" }}>Total Seats</span>}
                rules={[{ required: true, message: "Total seats" }]}
              >
                <InputNumber style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} min={1} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default AdminScreens;
import { Tag } from "antd";
