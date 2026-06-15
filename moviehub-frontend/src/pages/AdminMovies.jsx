import React, { useEffect, useState } from "react";
import { Table, Button, Space, Drawer, Form, Input, InputNumber, Select, DatePicker, message, Card, Popconfirm, Spin, Alert, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { getAllMovies, createMovie, updateMovie, deleteMovie } from "../services/movieService";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

export const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMovies();
      setMovies(data || []);
    } catch (err) {
      console.error("Failed to load admin movies:", err);
      setError("Failed to fetch movies list from backend database.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (movie = null) => {
    setEditingMovie(movie);
    if (movie) {
      form.setFieldsValue({
        ...movie,
        releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
      });
    } else {
      form.resetFields();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMovie(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const payload = {
      ...values,
      releaseDate: values.releaseDate ? values.releaseDate.format("YYYY-MM-DD") : null,
    };

    try {
      if (editingMovie) {
        await updateMovie(editingMovie.id, payload);
        message.success("Movie updated successfully!");
      } else {
        await createMovie(payload);
        message.success("Movie created successfully!");
      }
      loadMovies();
      handleClose();
    } catch (err) {
      console.error("Failed to save movie:", err);
      message.error("Failed to save movie details to the database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMovie(id);
      message.success("Movie deleted successfully!");
      loadMovies();
    } catch (err) {
      console.error("Failed to delete movie:", err);
      message.error("Failed to delete movie from database. Check for scheduled show dependencies.");
    }
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "posterUrl",
      key: "posterUrl",
      render: (url, record) => (
        <img 
          src={url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=100&auto=format&fit=crop"} 
          alt={record.title} 
          style={{ width: "50px", height: "70px", objectFit: "cover", borderRadius: "4px", border: "1px solid #303030" }} 
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span style={{ fontWeight: "bold", color: "#fff" }}>{text}</span>,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Duration (min)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (r) => r?.toFixed(1) || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "NOW_SHOWING" ? "green" : status === "COMING_SOON" ? "orange" : "red";
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
            title="Delete movie?"
            description="This will permanently delete the movie records."
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
        title={<span style={{ color: "#fff" }}><Title level={4} style={{ color: "#fff", margin: 0 }}>Movie Management</Title></span>}
        style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpen()}
            style={{ backgroundColor: "#F84464", borderColor: "#F84464", fontWeight: "bold" }}
          >
            Add Movie
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={movies}
          rowKey="id"
          loading={loading ? { indicator: <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: "#F84464" }} />} /> } : false}
          scroll={{ x: 800 }}
          className="dark-table"
        />
      </Card>

      {/* Editor Drawer */}
      <Drawer
        title={<span style={{ color: "#fff" }}>{editingMovie ? "Edit Movie Details" : "Add New Movie"}</span>}
        placement="right"
        width={500}
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
              Save Movie
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
            name="title"
            label={<span style={{ color: "#fff" }}>Movie Title</span>}
            rules={[{ required: true, message: "Please enter the movie title" }]}
          >
            <Input style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span style={{ color: "#fff" }}>Description</span>}
          >
            <Input.TextArea style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="genre"
                label={<span style={{ color: "#fff" }}>Genre</span>}
                rules={[{ required: true, message: "Please specify genre" }]}
              >
                <Input placeholder="Sci-Fi / Action" style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="language"
                label={<span style={{ color: "#fff" }}>Language</span>}
                rules={[{ required: true, message: "Please enter language" }]}
              >
                <Input placeholder="English" style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label={<span style={{ color: "#fff" }}>Duration (Minutes)</span>}
                rules={[{ required: true, message: "Please specify duration" }]}
              >
                <InputNumber style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rating"
                label={<span style={{ color: "#fff" }}>Rating (0.0 to 10.0)</span>}
                rules={[{ required: true, message: "Please enter rating" }]}
              >
                <InputNumber style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} min={0} max={10} step={0.1} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="releaseDate"
                label={<span style={{ color: "#fff" }}>Release Date</span>}
                rules={[{ required: true, message: "Please select release date" }]}
              >
                <DatePicker style={{ width: "100%", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={<span style={{ color: "#fff" }}>Movie Status</span>}
                rules={[{ required: true, message: "Select display status" }]}
              >
                <Select style={{ width: "100%" }} dropdownStyle={{ backgroundColor: "#1f1f1f" }}>
                  <Option value="NOW_SHOWING">NOW_SHOWING</Option>
                  <Option value="COMING_SOON">COMING_SOON</Option>
                  <Option value="ENDED">ENDED</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="director"
            label={<span style={{ color: "#fff" }}>Director</span>}
          >
            <Input style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
          </Form.Item>

          <Form.Item
            name="castMembers"
            label={<span style={{ color: "#fff" }}>Cast Members (Comma Separated)</span>}
          >
            <Input.TextArea placeholder="Leonardo DiCaprio, Tom Hardy" style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} rows={2} />
          </Form.Item>

          <Form.Item
            name="posterUrl"
            label={<span style={{ color: "#fff" }}>Poster Image URL</span>}
          >
            <Input placeholder="https://unsplash.com/..." style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
          </Form.Item>

          <Form.Item
            name="trailerUrl"
            label={<span style={{ color: "#fff" }}>Trailer Video URL</span>}
          >
            <Input placeholder="https://youtube.com/watch?v=..." style={{ backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#434343" }} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default AdminMovies;
import { Tag } from "antd";
