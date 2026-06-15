import React, { useEffect, useState } from "react";
import { Table, Button, Space, Drawer, Form, InputNumber, Select, DatePicker, TimePicker, message, Card, Popconfirm, Spin, Alert, Typography, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { getAllShows, createShow, updateShow, deleteShow } from "../services/showService";
import { getAllMovies } from "../services/movieService";
import { getAllScreens } from "../services/theatreService";
import { formatTime, formatDate } from "../utils/dateUtils";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

export const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const showsData = await getAllShows();
      const showsList = showsData.content || showsData || [];
      setShows(showsList);

      const moviesData = await getAllMovies();
      setMovies(moviesData || []);

      const screensData = await getAllScreens();
      setScreens(screensData || []);
    } catch (err) {
      console.error("Failed to load show management data:", err);
      setError("Failed to fetch shows schedule list and mapping catalog dependencies.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (show = null) => {
    setEditingShow(show);
    if (show) {
      form.setFieldsValue({
        movieId: show.movie?.id || show.movieId,
        screenId: show.screen?.id || show.screenId,
        showDate: show.showDate ? dayjs(show.showDate) : null,
        startTime: show.startTime ? dayjs(`2026-01-01T${show.startTime}`) : null,
        endTime: show.endTime ? dayjs(`2026-01-01T${show.endTime}`) : null,
        basePrice: show.basePrice,
      });
    } else {
      form.resetFields();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingShow(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const payload = {
      movieId: values.movieId,
      screenId: values.screenId,
      showDate: values.showDate ? values.showDate.format("YYYY-MM-DD") : null,
      startTime: values.startTime ? values.startTime.format("HH:mm:ss") : null,
      endTime: values.endTime ? values.endTime.format("HH:mm:ss") : null,
      basePrice: values.basePrice,
    };

    try {
      if (editingShow) {
        await updateShow(editingShow.id, payload);
        message.success("Show scheduling updated successfully!");
      } else {
        await createShow(payload);
        message.success("Show created successfully!");
      }
      loadData();
      handleClose();
    } catch (err) {
      console.error("Failed to save show:", err);
      message.error("Failed to save show schedule.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteShow(id);
      message.success("Show deleted successfully!");
      loadData();
    } catch (err) {
      console.error("Failed to delete show:", err);
      message.error("Failed to delete show. Verify that no active booking dependencies exist.");
    }
  };

  const columns = [
    {
      title: "Movie Title",
      dataIndex: ["movie", "title"],
      key: "movieTitle",
      render: (title, record) => <span style={{ fontWeight: "bold", color: "#fff" }}>{title || `Movie ID: ${record.movieId}`}</span>,
    },
    {
      title: "Theatre Cinema",
      dataIndex: ["screen", "theatre", "name"],
      key: "theatreName",
      render: (name, record) => <span>{name || record.screen?.name || "Theatre Screen"}</span>,
    },
    {
      title: "Screen No",
      dataIndex: ["screen", "screenNumber"],
      key: "screenNumber",
      render: (num) => <span>Screen {num || 1}</span>,
    },
    {
      title: "Show Date",
      dataIndex: "showDate",
      key: "showDate",
      render: (date) => <span>{formatDate(date)}</span>,
    },
    {
      title: "Timings",
      key: "timings",
      render: (_, record) => <span>{formatTime(record.startTime)} - {formatTime(record.endTime)}</span>,
    },
    {
      title: "Ticket Base Price",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (price) => <span style={{ color: "#52c41a", fontWeight: "bold" }}>₹{price}</span>,
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
            title="Delete show schedule?"
            description="All tickets and seat logs on this show will be lost."
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
        title={<span style={{ color: "#fff" }}><Title level={4} style={{ color: "#fff", margin: 0 }}>Showtimes Management</Title></span>}
        style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpen()}
            style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
          >
            Add Show
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={shows}
          rowKey="id"
          loading={loading ? { indicator: <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: "#F84464" }} />} /> } : false}
          scroll={{ x: 800 }}
          className="dark-table"
        />
      </Card>

      {/* Show Drawer */}
      <Drawer
        title={<span style={{ color: "#fff" }}>{editingShow ? "Edit Show Details" : "Schedule New Show"}</span>}
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
              Schedule Show
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
            name="movieId"
            label={<span style={{ color: "#fff" }}>Select Movie</span>}
            rules={[{ required: true, message: "Please select movie" }]}
          >
            <Select style={{ width: "100%" }} dropdownStyle={{ backgroundColor: "#1f1f1f" }}>
              {movies.map((m) => (
                <Option key={m.id} value={m.id}>{m.title} ({m.language})</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="screenId"
            label={<span style={{ color: "#fff" }}>Assign Screen Auditorium</span>}
            rules={[{ required: true, message: "Please select theater auditorium screen" }]}
          >
            <Select style={{ width: "100%" }} dropdownStyle={{ backgroundColor: "#1f1f1f" }}>
              {screens.map((s) => (
                <Option key={s.id} value={s.id}>{s.theatre?.name || "Theatre"} | {s.name || `Screen ${s.screenNumber}`}</Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="showDate"
                label={<span style={{ color: "#fff" }}>Show Date</span>}
                rules={[{ required: true, message: "Please select scheduling date" }]}
              >
                <DatePicker style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label={<span style={{ color: "#fff" }}>Start Time</span>}
                rules={[{ required: true, message: "Start time required" }]}
              >
                <TimePicker format="HH:mm:ss" style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label={<span style={{ color: "#fff" }}>End Time</span>}
                rules={[{ required: true, message: "End time required" }]}
              >
                <TimePicker format="HH:mm:ss" style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="basePrice"
            label={<span style={{ color: "#fff" }}>Base Ticket Price (₹)</span>}
            rules={[{ required: true, message: "Ticket price required" }]}
          >
            <InputNumber style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} min={1} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default AdminShows;
