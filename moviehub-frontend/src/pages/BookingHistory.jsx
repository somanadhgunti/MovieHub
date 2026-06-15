import React, { useEffect, useState } from "react";
import { Table, Button, Card, Tag, Typography, Breadcrumb, Input, Select, Space, Spin, Alert, Modal, Empty } from "antd";
import { SearchOutlined, LoadingOutlined, FileTextOutlined, CalendarOutlined, FunnelPlotOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, formatTime } from "../utils/dateUtils";
import { getBookingsByUser, resolveBookings, cancelBooking } from "../services/bookingService";
import { useAuth } from "../hooks/useAuth";
import ETicket from "../components/customer/ETicket";
import notificationService from "../utils/notificationService";

const { Title, Text } = Typography;
const { Option } = Select;

export const BookingHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [activeTicket, setActiveTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("Change of plans");
  const [cancelLoading, setCancelLoading] = useState(false);

  const isBeforeShowStart = (showDate, showTime) => {
    if (!showDate || !showTime || showDate === "N/A" || showTime === "N/A") return false;
    try {
      const showDateTime = new Date(`${showDate}T${showTime}`);
      if (isNaN(showDateTime.getTime())) return false;
      return new Date() < showDateTime;
    } catch (err) {
      console.error("Failed to parse date/time for cancellation validation:", err);
      return false;
    }
  };

  const handleCancelClick = (bookingObj) => {
    setBookingToCancel(bookingObj);
    setCancellationReason("Change of plans");
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;
    setCancelLoading(true);
    try {
      await cancelBooking(bookingToCancel.bookingId, cancellationReason);
      notificationService.success(
        "Booking Cancelled",
        `Booking ${bookingToCancel.bookingNumber} has been successfully cancelled.`
      );
      setCancelModalOpen(false);
      
      // Reload history
      const userId = user?.id || 1;
      const data = await getBookingsByUser(userId);
      const resolved = await resolveBookings(data);
      setBookings(resolved || []);
    } catch (err) {
      console.error("Cancellation failed:", err);
      const errorMsg =
        err.response?.status === 404
          ? "The booking cancellation API endpoint is currently not implemented on the backend."
          : err.response?.data?.message || "Failed to cancel this booking.";
      notificationService.error("Cancellation Failed", errorMsg);
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = user?.id || 1;
        const data = await getBookingsByUser(userId);
        const resolved = await resolveBookings(data);
        setBookings(resolved || []);
      } catch (err) {
        console.error("Failed to load booking history:", err);
        setError("Failed to fetch bookings list from the backend server.");
        notificationService.error("History Load Failed", "Unable to retrieve your booking history.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const handleView = (bookingObj) => {
    setActiveTicket(bookingObj);
    setModalOpen(true);
  };

  // Filter pipeline
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.movieTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Booking Number",
      dataIndex: "bookingNumber",
      key: "bookingNumber",
      render: (text) => <Text style={{ color: "#fff", fontFamily: "monospace", fontWeight: "bold" }}>{text}</Text>,
    },
    {
      title: "Movie",
      dataIndex: "movieTitle",
      key: "movieTitle",
      render: (text, record) => (
        <div>
          <span style={{ fontWeight: "bold", color: "#fff" }}>{text}</span>
          <span style={{ display: "block", fontSize: "11px", color: "#8c8c8c" }}>{record.language}</span>
        </div>
      ),
    },
    {
      title: "Theatre",
      dataIndex: "theatreName",
      key: "theatreName",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Screen",
      dataIndex: "screenNumber",
      key: "screenNumber",
      render: (text) => <span style={{ fontWeight: "500" }}>{text ? `Screen ${text}` : "N/A"}</span>,
    },
    {
      title: "Show Date",
      dataIndex: "showDate",
      key: "showDate",
      render: (text, record) => (
        <div>
          <span>{formatDate(text)}</span>
          <span style={{ display: "block", fontSize: "11px", color: "#8c8c8c" }}>{formatTime(record.showTime)}</span>
        </div>
      ),
    },
    {
      title: "Seats",
      dataIndex: "seats",
      key: "seats",
      render: (seats) => (
        <span style={{ color: "#F84464", fontWeight: "500" }}>
          {seats?.map((s) => `${s.rowNumber}${s.seatNumber}`).join(", ") || "N/A"}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => <span style={{ fontWeight: "bold", color: "#52c41a" }}>{formatCurrency(amount)}</span>,
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status, record) => (
        <div>
          <Tag color={status === "CONFIRMED" ? "green" : "red"}>
            {status}
          </Tag>
          {status === "CANCELLED" && record.cancellationReason && (
            <span style={{ display: "block", fontSize: "11px", color: "#8c8c8c", marginTop: "4px" }}>
              Reason: {record.cancellationReason}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const canCancel = record.bookingStatus === "CONFIRMED" && isBeforeShowStart(record.showDate, record.showTime);
        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleView(record)}
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff", fontWeight: "bold" }}
            >
              View Ticket
            </Button>
            {canCancel && (
              <Button
                type="primary"
                danger
                size="small"
                onClick={() => handleCancelClick(record)}
                style={{ fontWeight: "bold" }}
              >
                Cancel Booking
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "450px", background: "#141414" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: "#F84464" }} spin />} />
        <span style={{ color: "#8c8c8c", marginTop: "15px" }}>Loading booking records...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", background: "#141414", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Alert message="Connection Error" description={error} type="error" showIcon />
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#141414", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Navigation Breadcrumb */}
        <Breadcrumb
          style={{ marginBottom: "25px" }}
          items={[
            { title: <Link to="/home" style={{ color: "#8c8c8c" }}>Home</Link> },
            { title: <span style={{ color: "#ffffff" }}>Booking History</span> }
          ]}
        />

        <div style={{ borderBottom: "1px solid #303030", paddingBottom: "15px", marginBottom: "30px" }}>
          <Title level={2} style={{ color: "#ffffff", margin: 0, fontWeight: "bold" }}>
            My Booking History
          </Title>
          <Text type="secondary" style={{ color: "#8c8c8c" }}>
            Explore and review all tickets booked under your profile.
          </Text>
        </div>

        {/* Filters and search card */}
        <Card 
          style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px", marginBottom: "30px" }}
          bodyStyle={{ padding: "16px" }}
        >
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
            <Input
              placeholder="Search by Movie or Booking Ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
              style={{ width: "300px", backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }}
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "200px" }}
              dropdownStyle={{ backgroundColor: "#1f1f1f" }}
              suffixIcon={<FunnelPlotOutlined style={{ color: "#8c8c8c" }} />}
            >
              <Option value="ALL">All Bookings</Option>
              <Option value="CONFIRMED">Confirmed</Option>
              <Option value="CANCELLED">Cancelled</Option>
            </Select>
          </div>
        </Card>

        {filteredBookings.length === 0 ? (
          <Empty 
            description="No bookings match your selection criteria." 
            style={{ padding: "60px 0" }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Card style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}>
            <Table
              columns={columns}
              dataSource={filteredBookings}
              rowKey="bookingId"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 900 }}
              className="dark-table"
              style={{ backgroundColor: "transparent" }}
            />
          </Card>
        )}

      </div>

      {/* Ticket View Modal */}
      <Modal
        title={<span style={{ color: "#fff", fontWeight: "bold" }}><CalendarOutlined /> M-Ticket Viewer</span>}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={750}
        style={{ top: "10%" }}
        bodyStyle={{ backgroundColor: "#141414", padding: "10px" }}
      >
        <ETicket booking={activeTicket} tickets={activeTicket?.tickets} />
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal
        title={<span style={{ color: "#fff", fontWeight: "bold" }}>Cancel Booking</span>}
        open={cancelModalOpen}
        onOk={handleCancelConfirm}
        onCancel={() => setCancelModalOpen(false)}
        okText="Cancel Booking"
        cancelText="Keep Booking"
        okButtonProps={{ danger: true, loading: cancelLoading }}
        bodyStyle={{ backgroundColor: "#141414", padding: "10px" }}
      >
        <div style={{ color: "#fff", marginBottom: "15px" }}>
          Are you sure you want to cancel your booking for <strong>{bookingToCancel?.movieTitle}</strong>?
          This action cannot be undone.
        </div>
        <div style={{ marginBottom: "10px" }}>
          <span style={{ color: "#8c8c8c", display: "block", marginBottom: "5px" }}>Reason for cancellation:</span>
          <Input.TextArea
            rows={3}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Please specify a reason..."
            style={{ backgroundColor: "#141414", color: "#fff", borderColor: "#434343" }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default BookingHistory;
