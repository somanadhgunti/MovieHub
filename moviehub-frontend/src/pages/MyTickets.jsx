import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Table, Typography, Button, Tag, Breadcrumb, Alert, Empty, Spin, Modal, Space, message } from "antd";
import { DownloadOutlined, EyeOutlined, ClockCircleOutlined, EnvironmentOutlined, LoadingOutlined } from "@ant-design/icons";
import { formatTime, formatDate } from "../utils/dateUtils";
import { getBookingsByUser, resolveBookings } from "../services/bookingService";
import { useAuth } from "../hooks/useAuth";
import ETicket from "../components/customer/ETicket";
import notificationService from "../utils/notificationService";

const { Title, Text } = Typography;

export const MyTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTicket, setActiveTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = user?.id || 1;
        const bookings = await getBookingsByUser(userId);
        const resolvedBookings = await resolveBookings(bookings);
        
        // Map individual tickets from resolved bookings
        const individualTickets = resolvedBookings.flatMap((b) => 
          (b.tickets || []).map((t) => {
            // Find the specific seat matching this ticket's showSeatId
            const matchedSeat = b.seats?.find(s => s.showSeatId === t.showSeatId || s.id === t.showSeatId);
            const seatLabel = matchedSeat ? `${matchedSeat.rowNumber}${matchedSeat.seatNumber}` : "N/A";
            
            return {
              id: t.ticketId || t.id,
              ticketNumber: t.ticketNumber,
              ticketStatus: t.ticketStatus,
              movieTitle: b.movieTitle,
              language: b.language,
              theatreName: b.theatreName,
              theatreCity: b.theatreCity,
              screenNumber: b.screenNumber,
              showDate: b.showDate,
              showTime: b.showTime,
              seatNumber: seatLabel,
              totalAmount: b.totalAmount,
              bookingNumber: b.bookingNumber,
              booking: b
            };
          })
        );
        
        setTickets(individualTickets);
      } catch (err) {
        console.error("Failed to load user tickets:", err);
        const errMsg = err.response?.data?.message || err.message || "Failed to fetch tickets from the backend server.";
        setError(errMsg);
        notificationService.error("Failed to Load Tickets", errMsg);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTickets();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const handleDownload = (ticketId, ticketObj) => {
    setDownloadingId(ticketId);
    message.loading({ content: `Compiling PDF print for Ticket: ${ticketObj.ticketNumber}...`, key: "dl" });
    
    setTimeout(() => {
      const textContent = `MovieHub E-Ticket\n====================\nTicket Number: ${ticketObj.ticketNumber}\nBooking Ref: ${ticketObj.bookingNumber}\nMovie: ${ticketObj.movieTitle || "N/A"}\nCinema: ${ticketObj.theatreName || "N/A"}\nCity: ${ticketObj.theatreCity || "N/A"}\nScreen: ${ticketObj.screenNumber || 1}\nSeat: ${ticketObj.seatNumber}\nShow Date: ${ticketObj.showDate || "N/A"}\nShow Time: ${ticketObj.showTime || "N/A"}\nStatus: ${ticketObj.ticketStatus || "N/A"}`;
      const blob = new Blob([textContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `MovieHub-Ticket-${ticketObj.ticketNumber}.txt`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      message.success({ content: "Ticket Downloaded successfully!", key: "dl" });
      setDownloadingId(null);
    }, 1500);
  };

  const handleView = (ticketObj) => {
    setActiveTicket(ticketObj.booking);
    setModalOpen(true);
  };

  const columns = [
    {
      title: "Ticket Number",
      dataIndex: "ticketNumber",
      key: "ticketNumber",
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
      title: "Theatre Screen",
      dataIndex: "theatreName",
      key: "theatreName",
      render: (text, record) => (
        <div>
          <span>{text}</span>
          <span style={{ display: "block", fontSize: "11px", color: "#8c8c8c" }}>Screen {record.screenNumber}</span>
        </div>
      ),
    },
    {
      title: "Show Date & Time",
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
      title: "Seat",
      dataIndex: "seatNumber",
      key: "seatNumber",
      render: (seat) => <Tag color="#F84464" style={{ fontWeight: "bold" }}>{seat}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "ticketStatus",
      key: "ticketStatus",
      render: (status) => (
        <Tag color={status === "VALID" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff", fontWeight: "bold" }}
          >
            View Ticket
          </Button>
          <Button
            type="default"
            size="small"
            icon={<DownloadOutlined />}
            loading={downloadingId === record.id}
            onClick={() => handleDownload(record.id, record)}
            style={{ backgroundColor: "#2b2b2b", color: "#fff", borderColor: "#434343" }}
          >
            Download
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "450px", background: "#141414" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: "#F84464" }} spin />} />
        <span style={{ color: "#8c8c8c", marginTop: "15px" }}>Loading tickets...</span>
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
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumb
          style={{ marginBottom: "25px" }}
          items={[
            { title: <Link to="/home" style={{ color: "#8c8c8c" }}>Home</Link> },
            { title: <span style={{ color: "#ffffff" }}>My Tickets</span> }
          ]}
        />

        <div style={{ borderBottom: "1px solid #303030", paddingBottom: "15px", marginBottom: "30px" }}>
          <Title level={2} style={{ color: "#ffffff", margin: 0, fontWeight: "bold" }}>
            My Tickets
          </Title>
          <Text type="secondary" style={{ color: "#8c8c8c" }}>
            Explore and print your running movie entry tickets.
          </Text>
        </div>

        {tickets.length === 0 ? (
          <Empty 
            description="No tickets issued under your account. Explore recommended movies to book today!" 
            style={{ padding: "60px 0" }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Card style={{ backgroundColor: "#1f1f1f", border: "1px solid #303030", borderRadius: "8px" }}>
            <Table
              columns={columns}
              dataSource={tickets}
              rowKey="id"
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
        title={<span style={{ color: "#fff", fontWeight: "bold" }}>M-Ticket Viewer</span>}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={750}
        style={{ top: "10%" }}
        bodyStyle={{ backgroundColor: "#141414", padding: "10px" }}
      >
        <ETicket booking={activeTicket} />
      </Modal>
    </div>
  );
};

export default MyTickets;
